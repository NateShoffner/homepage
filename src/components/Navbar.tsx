import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <a className="navbar-brand" href="#page-top">
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
          <li className="nav-item">
            <NavLink className="nav-link" to="/#about">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/#blog">
              Blog
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              to="/#projects"
            >
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/#contact">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <ul className="social-list">
              <li>
                <a href="https://twitter.com/NateShoffner">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-twitter fa-stack-1x  fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://github.com/NateShoffner">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/NateShoffner">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-linkedin fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
