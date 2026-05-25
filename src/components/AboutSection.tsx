"use client";

import { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import type { PostMeta } from "@/lib/blog";
import type { Project } from "@/src/types/Project";
import { tokenizeJson, renderTokens, type Token } from "@/src/utils/jsonTokenizer";

// --- Console line types ---

type LineKind = "info" | "ok" | "warn" | "json" | "blank";

interface ConsoleLine {
  kind: LineKind;
  text?: string;
  jsonString?: string;
  tokens?: Token[];
  delay: number;
}

function buildLines(posts: PostMeta[], projects: Project[]): ConsoleLine[] {
  const lastPost = posts[0];
  const lastDate = lastPost ? new Date(lastPost.date) : null;
  const daysSince = lastDate ? Math.floor((Date.now() - lastDate.getTime()) / 86400000) : null;
  const monthsSince = daysSince !== null ? Math.round(daysSince / 30) : null;

  const siteData = {
    site: {
      name: "nateshoffner.github.io",
      author: "Nate Shoffner",
      location: "Lancaster, PA",
      role: "Senior Software / Elastic Certified Engineer",
    },
    sections: ["about", "blog", "projects", "contact"],
    about: {
      bio: "Software engineer based in Lancaster, Pennsylvania. Passionate about all things tech, solving interesting problems, learning how things work, and [simultaneously] breaking and building things.",
      interests: [
        "Full-Stack & API Development",
        "Observability & Data Engineering (ELK)",
        "Mobile Development",
        "Embedded & IoT (ESP32)",
        "Reverse Engineering",
        "Homelab & Home Automation",
      ],
    },
    blog: {
      total: posts.length,
      recent: posts.slice(0, 3).map((p) => ({ title: p.title, date: p.date, slug: p.slug })),
    },
    projects: {
      total: projects.length,
      featured: projects.slice(0, 3).map((p) => ({ name: p.name, description: p.description })),
    },
  };

  const jsonString = JSON.stringify(siteData, null, 2);
  const tokens = tokenizeJson(jsonString);

  const lines: ConsoleLine[] = [
    { kind: "info", text: "Initializing nateshoffner.github.io...", delay: 90  },
    { kind: "info", text: "Loading configuration...",               delay: 70  },
    { kind: "ok",   text: "Configuration loaded",                   delay: 80  },
    { kind: "info", text: "Fetching content...",                    delay: 60  },
    { kind: "ok",   text: `Found ${posts.length} blog posts, ${projects.length} projects`, delay: 110 },
  ];

  if (daysSince !== null && monthsSince !== null && lastDate) {
    lines.push({
      kind: "warn",
      text: `Last post ${lastDate.toISOString().slice(0, 10)} (~${monthsSince} months ago). Freshness not guaranteed.`,
      delay: 160,
    });
  }

  lines.push(
    { kind: "blank", delay: 40  },
    { kind: "info",  text: "Loading site data...", delay: 30  },
    { kind: "json",  jsonString, tokens, delay: 100 },
    { kind: "blank", delay: 40  },
    { kind: "info",  text: "Rendering...", delay: 500 },
  );

  return lines;
}

// --- Component ---

type Phase = "loading" | "running" | "fading" | "about";
const JSON_CHARS_PER_TICK = 50;
const JSON_TICK_MS = 6;

export function AboutSection() {
  const [phase, setPhase]         = useState<Phase>("loading");
  const [lines, setLines]         = useState<ConsoleLine[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [jsonChars, setJsonChars] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/blog/posts").then((r) => r.json()).catch(() => []),
      fetch("/api/projects").then((r) => r.json()).catch(() => []),
    ]).then(([posts, projects]: [PostMeta[], Project[]]) => {
      setLines(buildLines(posts, projects));
      setPhase("running");
    });
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const line = lines[lineIndex];
    if (!line) { setPhase("fading"); return; }

    if (line.kind === "json") {
      const total = line.jsonString!.length;
      if (jsonChars < total) {
        const id = setTimeout(() => setJsonChars((c) => Math.min(c + JSON_CHARS_PER_TICK, total)), JSON_TICK_MS);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => { setLineIndex((i) => i + 1); setJsonChars(0); }, line.delay);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => setLineIndex((i) => i + 1), line.delay);
    return () => clearTimeout(id);
  }, [phase, lines, lineIndex, jsonChars]);

  useEffect(() => {
    if (phase !== "fading") return;
    const id = setTimeout(() => setPhase("about"), 300);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === "about") {
    return (
      <div className="about-content-reveal">
        <h1 className="mb-5">
          <ReactTyped
            strings={['Nate <span class="text-highlight">Shoffner</span>']}
            typeSpeed={100}
            showCursor={true}
          />
        </h1>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-6">
            <h3 className="subheading mb-5">About</h3>
            <p>
              Software engineer based in Lancaster, Pennsylvania. Passionate about
              all things tech, solving interesting problems, learning how things
              work, and [simultaneously] breaking and building things.
            </p>
            <p>
              Currently working as a Senior Software /{" "}
              <a href="https://certified.elastic.co/d2170b39-7c27-4811-952f-3085d6a0dda5">
                Elastic Certified Engineer
              </a>
              .
            </p>
            <p className="mb-5">
              I enjoy working on lots of little passion projects which you can
              find on my <a href="https://github.com/nateshoffner">GitHub</a> and
              getting involved within my{" "}
              <a href="https://techlancaster.com/">local tech scene</a>.
            </p>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <h3 className="subheading mb-5">Interests</h3>
            <div className="d-lg-inline-flex flex-row">
              <ul className="highlighted inlined-list">
                <li>Full-Stack &amp; API Development</li>
                <li>Observability &amp; Data Engineering (ELK)</li>
                <li>Mobile Development</li>
                <li>Embedded &amp; IoT (ESP32)</li>
                <li>Reverse Engineering</li>
                <li>Homelab &amp; Home Automation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const LOOKBACK = 5;
  const MAX_JSON_LINES = 12;
  const isFading = phase === "fading";
  const startIndex = Math.max(0, lineIndex - LOOKBACK + 1);
  const shownLines = lines.slice(startIndex, lineIndex + 1);

  return (
    <div
      className="console-output"
      style={{
        opacity: isFading ? 0 : 1,
        transition: isFading ? "opacity 0.3s ease" : undefined,
      }}
    >
      {phase === "loading" && <span className="json-cursor">█</span>}
      {shownLines.map((line, i) => {
        const absoluteIndex = startIndex + i;
        const isActive = absoluteIndex === lineIndex && !isFading;

        if (line.kind === "blank") {
          return <div key={absoluteIndex} className="console-blank" />;
        }

        if (line.kind === "json") {
          const typed = isActive ? line.jsonString!.slice(0, jsonChars) : line.jsonString!;
          const typedLines = typed.split("\n");
          const trimStart = Math.max(0, typedLines.length - MAX_JSON_LINES);
          const visible = typedLines.slice(trimStart).join("\n");
          const visibleTokens = tokenizeJson(visible);
          return (
            <pre key={absoluteIndex} className="console-json">
              {renderTokens(visibleTokens, visible.length)}
              {isActive && jsonChars < line.jsonString!.length && <span className="json-cursor">█</span>}
            </pre>
          );
        }

        const prefixMap: Record<string, React.ReactNode> = {
          info: <span className="console-prefix console-prefix-info">[INFO]</span>,
          ok:   <span className="console-prefix console-prefix-ok">[ OK ]</span>,
          warn: <span className="console-prefix console-prefix-warn">[WARN]</span>,
        };

        return (
          <div key={absoluteIndex} className={`console-line console-line-${line.kind}`}>
            {prefixMap[line.kind]} <span className="console-text">{line.text}</span>
            {isActive && <span className="json-cursor"> █</span>}
          </div>
        );
      })}
    </div>
  );
}

export default AboutSection;
