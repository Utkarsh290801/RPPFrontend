import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import rpplogo from "../../../Assets/images/Rpplogo.jpg"
const Header = () => {
  const navigate = useNavigate();
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const logout = () => {
    //destroy session value
    sessionStorage.removeItem("user");
    //  setloggedIn to false
    setloggedIn(false);
    //  navigate to login page
    navigate("/login");
  };
  return (
    <div>
      <nav
        style={{ fontSize: "18px", fontWeight: "bold" }}
        class="navbar navbar-expand-lg navbar-light bg-light "
      >
        {/* <!-- Container wrapper --> */}
        <div class="container-fluid">
          {/* <!-- Toggle button --> */}
          <button
            class="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>

          {/* <!-- Collapsible wrapper --> */}
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            {/* <!-- Navbar brand --> */}
            <a class="navbar-brand mt-2 mt-lg-0" href="#">
              <img
                src={rpplogo}
                height="45"
                alt="RppLogo"
                loading="lazy"
                className="rounded-circle"
              />{" "}
              Right Path Predictor
            </a>
            {/* <!-- Left links --> */}
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li class="nav-item">
                <NavLink className="nav-link" to="/user/service">
                  Internship Domain
                </NavLink>
              </li>
              <li class="nav-item">
                <NavLink className="nav-link" to="/dashboard/profile">
                 Dashboard
                </NavLink>
              </li>
              <li class="nav-item">
                <NavLink className="nav-link" to="/user/about">
                  About Us
                </NavLink>
              </li>
              <li class="nav-item">
                <NavLink className="nav-link" to="/user/contact">
                  Contact
                </NavLink>
              </li>
            </ul>
            {/* <!-- Left links --> */}
          </div>
          {/* <!-- Collapsible wrapper --> */}

          {/* <!-- Right elements --> */}
          <div class="d-flex align-items-center">
            {/* <!-- Avatar --> */}
            <div class="dropdown">
              <a
                class="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://img.freepik.com/free-icon/user_318-159711.jpg"
                  class="rounded-circle"
                  height="45"
                  alt="Black and White Portrait of a Man"
                  loading="lazy"
                />
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <a class="dropdown-item" href="/dashboard/profile">
                    Dashboard
                  </a>
                </li>

                <li>
                  <a class="dropdown-item" onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* <!-- Right elements --> */}
        </div>
        {/* <!-- Container wrapper --> */}
      </nav>
      {/* <!-- Navbar --> */}
    </div>
  );
};

export default Header;
