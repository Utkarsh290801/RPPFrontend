import React, { useContext, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Swal from "sweetalert2";
import app_config from "../../config";
const Profile = () => {
  const navigate = useNavigate();
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("admin"))
  );
  const [newPass, setNewPass] = useState("");
  const logout = () => {
    //destroy session value
    sessionStorage.removeItem("admin");
    //  setloggedIn to false
    setloggedIn(false);
    //  navigate to login page
    navigate("/login");
  };
  const passwordValidator = Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    );
    const url = app_config.backend_url;
  const onChangePassword = () => {
    if (!newPass) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a new password",
      });
      return;
    }

    if (!passwordValidator.isValidSync(newPass)) {
      Swal.fire({
        icon: "error",
        title: "Please check the requirements.",
        text: "Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      });
      return;
    }
    fetch(url + "/user/update/" + currentUser._id, {
      method: "PUT",
      body: JSON.stringify({
        password: newPass,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Failed to change password");
        }
      })
      .then((data) => {
        console.log(data);
        setCurrentUser(data);
        sessionStorage.setItem("user", JSON.stringify(data));
        Swal.fire({
          icon: "success",
          title: "Well done!",
          text: "Password changed successfully",
        });
        setNewPass("");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to change password",
        });
      });
  };
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

            <div className="d-flex justify-content-around">
              {/* <NavLink className="mainBtn mt-3" to="/dashboard/edit">
                Edit Profile
              </NavLink> */}

              <button className="mainBtn mt-3" onClick={logout}>
                Log out
              </button>
            </div>
            <div class="accordion mt-4" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Change Password
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <Form.Group>
                      <Form.Control
                        type="password"
                        placeholder="Change Password"
                        name="password"
                        onChange={(e) => setNewPass(e.target.value)}
                        value={newPass}
                      />
                    </Form.Group>
                    <div className="text-center">
                      <button
                        className="mainBtn mt-4"
                        type="button"
                        onClick={onChangePassword}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Profile;
