import React, { useEffect, useState } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import PopOver from "../PopOver/PopOver";
import Sidebar from "../Sidebar/Sidebar";
import "./Dashboard.css";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from "../Profile/Profile";
import TaskSubmission from "../Task/TaskSubmission";
import EditProfile from "../EditProfile/EditProfile";
import PaymentForm from "../Task/PaymentForm";
import Offerletter from "../OfferLetter/Offerletter";
import Certificate from "../Certificate/Certificate";
import TaskAllocation from "../TaskAllocation/TaskAllocation";
import Video from "../Training/Video";

const UserDashboard = () => {
  const [sideToggle, setSideToggle] = useState(false);
  const [title, setTitle] = useState("Right Path Predictor");

  return (
    <div id="dashboard">
      <div id="sidebar" className={sideToggle ? "active" : ""}>
        <div className="sidebarContent">
          <Sidebar setTitle={setTitle} />
          <div className="backBtnBox">
            <Link to="/">
              <button className="backBtn">
                <FontAwesomeIcon icon={faSignOutAlt} />
                back to home
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div id="pageContent">
        <div className="dashBoardHeader">
          <div className="d-flex align-items-center">
            <div
              id="nav-icon"
              className={sideToggle ? "menu-btn" : "menu-btn open"}
              onClick={() => setSideToggle(!sideToggle)}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h3>{title}</h3>
          </div>
          <PopOver />
        </div>

        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/submission" element={<TaskSubmission />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/offerletter" element={<Offerletter />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/taskallocated" element={<TaskAllocation />} />
          <Route path="/video" element={<Video />} />
        </Routes>

        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
