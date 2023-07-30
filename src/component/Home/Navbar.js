import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import PopOver from "../PopOver/PopOver";

const Navbar = ({ setFilter }) => {
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const [adminData, setAdminData] = useState(null);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    const checkSession = () => {
      const adminData = JSON.parse(sessionStorage.getItem("admin"));
      const userData = JSON.parse(sessionStorage.getItem("user"));
      setAdminData(adminData);
      if (adminData || userData) {
        setloggedIn(true);
      } else {
        setloggedIn(false);
      }
    };

    checkSession();
  }, [setloggedIn]);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand me-2" href="/">
            <img
              src="https://rightpathpredictor.in/sisotcha/2023/04/RPP-300x292.jpg"
              height="56"
              alt="MDB Logo"
              loading="lazy"
              style={{ marginTop: "-1px" }}
            />
          </a>
          <div className="d-flex flex-column">
            <h5
              className=""
              style={{
                color: "#7355F7",
                fontWeight: "bold",
                fontSize: "1.3rem",
              }}
            >
              Right Path Predictor
            </h5>
            <small
              className=""
              style={{ color: "black", fontWeight: "bold", fontSize: "1rem" }}
            >
              Intern. Grow. Succeed.
            </small>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarExample01"
            aria-controls="navbarExample01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarExample01">
            <form
              className="input-group mx-auto d-none d-sm-flex"
              style={{ width: "35%" }}
            >
              <input
                autoComplete="off"
                type="search"
                className="form-control rounded"
                placeholder="Search internships"
                style={{ minWidth: "165px" }}
                onChange={handleFilterChange}
              />
            </form>
            <ul className="navbar-nav ms-auto mb-lg-0 ">
              <li className="nav-item">
                <a
                  href="#about"
                  style={{ color: "#7355F7", fontWeight: "bold" }}
                  className=" nav-link"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#services"
                  style={{ color: "#7355F7", fontWeight: "bold" }}
                  className="nav-link"
                >
                  Internship Domain
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#contact"
                  style={{ color: "#7355F7", fontWeight: "bold" }}
                  className="nav-link"
                >
                  Contact Us
                </a>
              </li>
              {loggedIn && (
                <li className="nav-item">
                  {adminData ? (
                    <NavLink
                      to="/admin/profile"
                      style={{ color: "#7355F7", fontWeight: "bold" }}
                      className="nav-link"
                    >
                      Admin
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/dashboard/profile"
                      style={{ color: "#7355F7", fontWeight: "bold" }}
                      className="nav-link"
                    >
                      Dashboard
                    </NavLink>
                  )}
                </li>
              )}
              <li className="nav-item">
                {!loggedIn ? (
                  <NavLink
                    className="btn btn-outline-primary btn-lg m-2"
                    to="/login"
                  >
                    Login
                  </NavLink>
                ) : (
                  <PopOver />
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
