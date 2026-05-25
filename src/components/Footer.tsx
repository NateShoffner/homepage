const gitRevision = process.env.NEXT_PUBLIC_GIT_REVISION ?? "unknown";

export default function Footer() {
  return (
    <footer>
      <div className="text-muted">
        &copy; Nate Shoffner, {new Date().getFullYear()}. All rights reserved.
      </div>
      <div
        className="text-muted"
        style={{ fontSize: "0.82rem", opacity: 0.75 }}
      >
        Views expressed are my own and do not reflect those of my employer or
        affiliated organizations.
      </div>
      <div
        className="text-muted"
        style={{ fontSize: "0.82rem", opacity: 0.75 }}
      >
        <a href="/about/privacy">Privacy</a> &bull; Build:{" "}
        <a
          href={`https://github.com/NateShoffner/homepage/commit/${gitRevision}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {gitRevision}
        </a>
      </div>
    </footer>
  );
}
