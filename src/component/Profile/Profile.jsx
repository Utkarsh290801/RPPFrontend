import React, { useContext, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import "./Profile.css";
// import userimg from "../../Assets/images/user.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Swal from "sweetalert2";
import app_config from "../../config";
const Profile = () => {
  const url = app_config.backend_url;
  const navigate = useNavigate();
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [appliedStatus, setAppliedStatus] = useState(null);
  const logout = () => {
    //destroy session value
    sessionStorage.removeItem("user");
    //  setloggedIn to false
    setloggedIn(false);
    //  navigate to login page
    navigate("/login");
  };

  useEffect(() => {
    
    const fetchAppliedStatus = async () => {
      if (currentUser) {
        try {
          const res = await fetch(
            url+`/apply/checkuser/${currentUser._id}`
          );
          const planData = await res.json();
          if (planData) {
            setAppliedStatus(planData.domain);
          } else {
            setAppliedStatus("Not found");
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error!!",
            text: "Something went wrong!",
          });
        }
      }
    };

    fetchAppliedStatus();
  }, [currentUser]);
 

  return (
    <>
      <Col md={5} className="mx-auto">
        <div className="profile">
          <h2>Profile</h2>
          <div className="profileInfo">
            <img
              src="https://img.freepik.com/free-icon/user_318-159711.jpg"
              alt=""
            />
            <h3>{currentUser.username}</h3>
            <h5>{currentUser.email}</h5>

            {/* <>
              <p>
                Applied Status: Applied on{" "}
                <span>Web</span>
              </p>
            </> */}
            {appliedStatus !== null ? (
              Array.isArray(appliedStatus) && appliedStatus.length > 0 ? (
                appliedStatus.map((status, index) => (
                  <div key={index}>
                    <span style={{ fontWeight: "bold" }}>Applied on: </span>
                    {status}
                  </div>
                ))
              ) : (
                <p>Applied Status: Not applied</p>
              )
            ) : (
              <p>Loading...</p>
            )}
            <div className="d-flex justify-content-around">
              {/* <NavLink className="mainBtn mt-3" to="/dashboard/edit">
                Edit Profile
              </NavLink> */}

              <button className="mainBtn mt-3" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Profile;
