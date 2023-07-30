import React, { useContext, useEffect, useState } from "react";
import { Form, Col, Row, Toast } from "react-bootstrap";
import "./EditProfile.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import app_config from "../../config";
const EditProfile = () => {
  const navigate = useNavigate();
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [updateForm, setUpdateForm] = useState({});
  const [newPass, setNewPass] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  // const [applyDetails, setApplyDetails] = useState({});
  const [applyDetails, setApplyDetails] = useState(null);
  useEffect(() => {
    fetch(url + "/user/getbyid/" + currentUser._id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUpdateForm(data);
      });
    console.log(currentUser);
    fetch(url + "/apply/getbyuser/" + currentUser._id) // Fetch apply details
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setApplyDetails(data);
      });
  }, []);
  const onFormSubmit = (value, { setSubmitting }) => {
    fetch(url + "/user/update/" + currentUser._id, {
      method: "PUT",
      body: JSON.stringify(value),
      // body : JSON.stringify({
      //   password : newPass
      // })
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          console.log(data);
          setCurrentUser(data);
          sessionStorage.setItem("user", JSON.stringify(data));
        });
      }
      Swal.fire({
        icon: "success",
        title: "Welldone!",
        text: "You have successfully Updated",
      });
    });
  };
  const onApplyFormSubmit = (value, { setSubmitting }) => {
    fetch(url + "/apply/update/" + applyDetails._id, {
      method: "PUT",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Failed to update apply details");
        }
      })
      .then((data) => {
        console.log(data);
        setApplyDetails(data);
        Swal.fire({
          icon: "success",
          title: "Well done!",
          text: "You have successfully updated your apply details",
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update apply details",
        });
      });
  };
  const passwordValidator = Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    );

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
  const uploadFile = (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("myfile", file);
    fetch(url+"/util/uploadfile", {
      method: "POST",
      body: fd,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("file uploaded");
          return res.json(); // Parse the response as JSON
        } else {
          throw new Error("File upload failed");
        }
      })
      .then((data) => {
        // Get the file URL from the backend response
        const fileName = data.fileName; // Assuming the response contains the file name

        // Check if a resume already exists
        if (applyDetails.resume) {
          // Prompt the user for confirmation before updating the resume
          Swal.fire({
            title: "Are you sure?",
            text: "This will replace your current resume. Do you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              // User confirmed the update, so update the resume in the applyDetails state
              setApplyDetails((prevApplyDetails) => ({
                ...prevApplyDetails,
                resume: fileName,
              }));

              Swal.fire({
                icon: "success",
                title: "File Updated",
                text: "Now, Click on Update Detail",
              });
            }
          });
        } else {
          // No existing resume, so directly update the resume in the applyDetails state
          setApplyDetails((prevApplyDetails) => ({
            ...prevApplyDetails,
            resume: fileName,
          }));

          Swal.fire({
            icon: "success",
            title: "File Uploaded",
            text: "Resume uploaded successfully",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to upload resume",
        });
      });
  };

  return (
    <div>
      <div className="bookForm ">
        <div className="edit-profile ">
          <img
            src="https://img.freepik.com/free-icon/user_318-159711.jpg"
            alt=""
            className="rounded mx-auto d-block"
          />
          <div className="text-center">
            <NavLink className="h4 mt-4" to="/dashboard/profile">
              Profile
            </NavLink>
          </div>
        </div>
        {/* <Row>
          <Col md={6} xs={12} className="my-3">
            <Form.Label style={{ fontWeight: "bold" }}>Service</Form.Label>
            <select class="form-select">
              <option>bnbb</option>
              <option>bnb</option>
            </select>
          </Col>
          <Col md={6} xs={12} className="my-3">
            <Form.Label style={{ fontWeight: "bold" }}>Price</Form.Label>
            <div className="priceInput">99</div>
          </Col>
        </Row> */}
        <Formik
          enableReinitialize={true}
          initialValues={currentUser}
          onSubmit={onFormSubmit}
        >
          {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} xs={12}>
                  <Form.Group className="mt-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      name="username"
                      onChange={handleChange}
                      value={values.username}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Email
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Email Address"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <button className="mainBtn mt-4" type="submit">
                  Update Profile
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {applyDetails && (
          <Formik
            enableReinitialize={true}
            initialValues={applyDetails}
            onSubmit={onApplyFormSubmit}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} xs={12}>
                    <Form.Group className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Mobile Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Number.."
                        onChange={handleChange}
                        name="number"
                        value={values.number}
                      />
                    </Form.Group>

                    <Form.Group>
                      <div className="mt-3">
                        <Form.Label style={{ fontWeight: "bold" }}>
                          Gender
                        </Form.Label>
                        <div className="d-flex align-items-center justify-content-around">
                          {" "}
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={values.gender === "Male"}
                            onChange={handleChange}
                          />{" "}
                          Male
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={values.gender === "Female"}
                            onChange={handleChange}
                          />{" "}
                          Female
                        </div>
                      </div>
                    </Form.Group>
                    <div className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        College
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="College"
                        onChange={handleChange}
                        value={values.college}
                        name="college"
                      />
                    </div>
                    <div className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Course
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Course"
                        name="course"
                        onChange={handleChange}
                        value={values.course}
                      />
                    </div>
                  </Col>
                  <Col md={6} xs={12}>
                    <div className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Stream
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Stream"
                        name="stream"
                        onChange={handleChange}
                        value={values.stream}
                      />
                    </div>
                    <div className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Passing Year
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Year"
                        name="year"
                        onChange={handleChange}
                        value={values.year}
                      />
                    </div>
                    <div className="mt-3">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Github Profile Link
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Github Link.."
                        name="github"
                        onChange={handleChange}
                        value={values.github}
                      />
                    </div>
                    <div className="mt-2">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Linkedin Profile Link
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Linkedin Link.."
                        name="linkedin"
                        onChange={handleChange}
                        value={values.linkedin}
                      />
                    </div>
                    <div className="mt-2">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Resume
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Linkedin Link.."
                        name="resume"
                        onChange={uploadFile}
                      />
                      {applyDetails.resume && (
                        <>
                          <a
                            href={url+`/util/files/${applyDetails.resume}`}
                            target="_blank"
                            download
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                          {/* <button
                            className="mt-2"
                            type="button"
                            onClick={() =>
                              setApplyDetails({ ...applyDetails, resume: null })
                            }
                          >
                            Delete Resume
                          </button> */}
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <button className="mainBtn mt-4" type="submit">
                    Update Details
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
        <div className="mt-3">
          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>
              Change Password
            </Form.Label>
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
  );
};

export default EditProfile;
