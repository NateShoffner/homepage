import { NavLink, Link, useLocation } from "react-router-dom";
import { useLayoutEffect, MouseEvent } from "react";
import { useScrollSpy } from "@hooks/useScrollSpy";

type NavItem = { id: string; label: string; route: string; hash: string };
type SocialItem = { id: string; icon: string; url: string };

const NavItems: NavItem[] = [
  { id: "about", label: "About", route: "/about", hash: "/#about" },
  { id: "blog", label: "Blog", route: "/blog", hash: "/#blog" },
  { id: "projects", label: "Projects", route: "/projects", hash: "/#projects" },
  { id: "contact", label: "Contact", route: "/contact", hash: "/#contact" },
];

const SocialItems: SocialItem[] = [
  {
    id: "twitter",
    icon: "fa-twitter",
    url: "https://twitter.com/NateShoffner",
  },
  { id: "github", icon: "fa-github", url: "https://github.com/NateShoffner" },
  {
    id: "linkedin",
    icon: "fa-linkedin",
    url: "https://www.linkedin.com/in/NateShoffner",
  },
];

function scrollToId(id: string, offset = 80, smooth = true) {
  const el =
    document.getElementById(id) ||
    document.querySelector<HTMLElement>(`[name="${id}"]`);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
}

export default function Navbar() {
  const location = useLocation();
  const onHome = location.pathname === "/";

  // Scroll to hash when landing on "/" with a hash
  useLayoutEffect(() => {
    if (!onHome || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    scrollToId(id, 80, true);
  }, [onHome, location.hash]);

  // Lightweight scrollspy (only matters on "/")
  const activeSectionId = useScrollSpy(
    NavItems.map((n) => n.id),
    80
  );

  const isActive = (item: NavItem) => {
    if (onHome) {
      // prefer scrollspy; fall back to the URL hash
      return (activeSectionId ?? location.hash.replace("#", "")) === item.id;
    }
    return (
      location.pathname === item.route ||
      location.pathname.startsWith(`${item.route}/`)
    );
  };

  const handleHomeClick =
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return; // not home, let router navigate
      e.preventDefault();
      // Update the hash for sharable URL, then smooth scroll
      if (location.hash !== `#${id}`) {
        history.replaceState(null, "", `/#${id}`);
      }
      scrollToId(id, 80, true);
      // Close collapsed menu on mobile (Bootstrap)
      const el = document.getElementById("navbarSupportedContent");
      if (el?.classList.contains("show")) {
        (
          document.querySelector(".navbar-toggler") as HTMLButtonElement
        )?.click();
      }
    };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <NavLink to="/" className="navbar-brand" end>
        <span className="d-block d-lg-none">Nate Shoffner</span>
        <span className="d-none d-lg-block">
          <div className="circle-border">
            <div className="circle">
              <img
                className="img-fluid rounded-circle img-profile mx-auto"
                src="/assets/images/profile-pic.jpg"
                alt="Nate Shoffner"
              />
            </div>
          </div>
        </span>
      </NavLink>

      {/* If you're on Bootstrap 5, use data-bs-* attributes */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {NavItems.map((item) => {
            const active = isActive(item);
            const classes = `nav-link${active ? " active" : ""}`;
            return (
              <li className="nav-item" key={item.id}>
                {onHome ? (
                  // Hash navigation on homepage: use Link, not NavLink
                  <Link
                    to={{ hash: `#${item.id}` }}
                    onClick={handleHomeClick(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={classes}
                  >
                    {item.label}
                  </Link>
                ) : (
                  // Real routes elsewhere: use NavLink
                  <NavLink
                    to={item.route}
                    end
                    className={(
                      {
                        /* rr */
                      }
                    ) => classes}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            );
          })}

          <li className="nav-item">
            <ul className="social-list">
              {SocialItems.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i
                        className={`fa ${social.icon} fa-stack-1x fa-inverse`}
                      ></i>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
