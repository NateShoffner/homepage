const gitRevision = process.env.NEXT_PUBLIC_GIT_REVISION ?? 'unknown'
const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME ?? ''

export default function Footer() {
  return (
    <footer>
      <div className="text-muted">
        &copy; Nate Shoffner, {new Date().getFullYear()}. All rights reserved.
        <br />
        Disclaimer: Any views or opinions expressed on this website are my own
        and do not necessarily reflect those of my employer or any affiliated
        organizations.
        <br />
        <a href="/about/privacy">Privacy</a> &bull;{' '}
        <a href="/#contact">Report Issue</a> &bull; Build:{' '}
        <a
          href={`https://github.com/NateShoffner/nateshoffner.github.io/commit/${gitRevision}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {gitRevision}
        </a>{' '}
        &bull;{' '}
        {buildTime ? new Date(buildTime).toUTCString().replace('GMT', '+0000') : ''}
      </div>
    </footer>
  )
}
