import { NavLink, useLocation } from "react-router-dom";

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

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <a className="navbar-brand" href="/">
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
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {NavItems.map((item) => (
            <li className="nav-item" key={item.id}>
              <NavLink
                className={`nav-link ${
                  location.pathname.startsWith(item.route) ? "active" : ""
                }`}
                to={item.hash}
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          <li className="nav-item">
            <ul className="social-list">
              {SocialItems.map((social) => (
                <li key={social.id}>
                  <a href={social.url}>
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
