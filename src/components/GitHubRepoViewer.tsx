import React, { useEffect, useState } from "react";
import axios from "axios";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  fork: boolean;
  homepage: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

interface Props {
  usernames: string[];
  includeForks?: boolean;
  includePages?: boolean;
  showHomepage?: boolean;
  sortBy?: "created" | "updated" | "pushed" | "full_name";
}

const GitHubRepoViewer: React.FC<Props> = ({
  usernames,
  includeForks = true,
  includePages = true,
  showHomepage = true,
  sortBy = "pushed",
}) => {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const allRepos: Repo[] = [];

      await Promise.all(
        usernames.map(async (username) => {
          try {
            const response = await axios.get<Repo[]>(
              `https://api.github.com/users/${username}/repos?per_page=100&sort=${sortBy}`
            );
            allRepos.push(...response.data);
          } catch (err) {
            console.error(`Failed to fetch repos for ${username}`, err);
          }
        })
      );

      const filtered = allRepos.filter((repo) => {
        if (!includeForks && repo.fork) return false;
        if (!includePages && repo.name.endsWith(".github.io")) return false;
        return true;
      });

      const sorted = filtered.sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );

      setRepos(sorted);
    };

    fetchRepos();
  }, [usernames, includeForks, includePages, sortBy]);

  return (
    <div>
      {repos.map((repo, index) => (
        <div key={repo.id} className="gw-repo-outer">
          <div className="gw-repo">
            <div className="gw-title">
              <a
                href={repo.html_url}
                className="gw-name"
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
              <span className="gw-stats">
                <span className="gw-watchers">{repo.watchers_count}</span>
                <span className="gw-forks">{repo.forks_count}</span>
              </span>
            </div>
            <div className="gw-lang">{repo.language || "Unknown Language"}</div>
            <div>{repo.description || "No description available"}</div>
            {showHomepage && repo.homepage && (
              <div className="gw-homepage">
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.homepage}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="gw-clearer"></div>
    </div>
  );
};

export default GitHubRepoViewer;
