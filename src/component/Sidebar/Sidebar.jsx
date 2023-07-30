import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faCreditCard,
  faEnvelope,
  faFile,
  faFileInvoice,
  faFloppyDisk,
  faGraduationCap,
  faHome,
  faList,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ setTitle }) => {
  const handleLORClick = () => {
    alert("LOR Letter is not available");
  };

  return (
    <div>
      <div className="sideBrand">
        <div className="sideBrnIcon">
          <img
            src="https://rightpathpredictor.in/sisotcha/2023/04/RPP-300x292.jpg"
            height="46"
            alt="MDB Logo"
            loading="lazy"
          />
        </div>
        <h2>
          Right <span className="navHighlight">Path Predictor</span>
        </h2>
      </div>
      <nav id="sideNavbar">
        <ul>
          <li>
            <NavLink
              onClick={() => setTitle("Home")}
              activeclassname="activePage"
              exact
              to="/"
            >
              <FontAwesomeIcon icon={faHome} className="iconC" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Edit Profile")}
              activeclassname="activePage"
              exact
              to="/dashboard/edit"
            >
              <FontAwesomeIcon icon={faUserCircle} className="iconC" />
              Edit Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Internship Domain")}
              activeclassname="activePage"
              exact
              to="/user/service"
            >
           <FontAwesomeIcon icon={faGraduationCap} className="iconC"/>
               Internship Domain
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Offer Letter")}
              activeclassname="activePage"
              exact
              to="/dashboard/offerletter"
            >
              <FontAwesomeIcon icon={faFile} className="iconC" />
              View Offer Letter
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={() => setTitle("Allocated Task")}
              activeclassname="activePage"
              to="/dashboard/taskallocated"
            >
            <FontAwesomeIcon icon={faFileInvoice}  className="iconC"/>
              Allocated Task
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("References Video")}
              activeclassname="activePage"
              to="/dashboard/video"
            >
               <FontAwesomeIcon icon={faCirclePlay} className="iconC" />
              References Videos
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Task Submission")}
              activeclassname="activePage"
              to="/dashboard/submission"
            >
                 <FontAwesomeIcon icon={faFloppyDisk} className="iconC"/>
           
              Task Submission
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Payment Form")}
              activeclassname="activePage"
              to="/dashboard/payment"
            >
             <FontAwesomeIcon icon={faCreditCard} className="iconC" />
              Payment Form
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Internship Certificate")}
              activeclassname="activePage"
              to="/dashboard/certificate"
            >
              <FontAwesomeIcon icon={faEnvelope} className="iconC" />
              Internship Certificate
            </NavLink>
          </li>
          <li>
            <NavLink onClick={handleLORClick} activeclassname="activePage">
              <FontAwesomeIcon icon={faList} className="iconC" />
              LOR Letter
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setTitle("Contact Us")}
              activeclassname="activePage"
              to="/user/contact"
            >
              <FontAwesomeIcon icon={faList} className="iconC" />
              Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
