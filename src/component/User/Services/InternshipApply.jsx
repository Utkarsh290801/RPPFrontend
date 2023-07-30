import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InternshipApply.css";
import { Formik, useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import app_config from "../../../config";
const InternshipApply = () => {
  const { id } = useParams();
  const url = app_config.backend_url;
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState("");
  const [modelData, setModelData] = useState(null);
  const [applyData, setApplyData] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    gender: Yup.string().required("Gender is required"),
    number: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\d{10}$/,
        "Phone number must be exactly 10 digits long and should contain only numbers"
      ),
    // linkedin: Yup.string().url("Invalid URL"),
  });

  const Apply = {
    number: "",
    gender: "",
    linkedin: "",
    github: "",
    course: "",
    stream: "",
    college: "",
    year: "",
    resume: applyData?.resume || resumeUrl,
    appliedBy: currentUser?.email || "",
    appliedName: currentUser?.username || "",
    domain: [],
  };

  const fetchPageData = async () => {
    const res = await fetch(url + "/apply/getbyuser/" + currentUser._id);
    const data = await res.json();
    setApplyData(data);
  };

  useEffect(() => {
    setIsLoading(true); // Set loading state to true
    fetchPageData()
      .then(() => setIsLoading(false)) // Set loading state to false when the data is fetched
      .catch((error) => {
        console.error("Error fetching page data:", error);
        setIsLoading(false); // Set loading state to false in case of an error
      });
  }, []);

  const addSubmit = (values, { setSubmitting }) => {
    setIsLoading(true);
    const updatedValues = {
      ...values,
      resume: resumeUrl,
      domain: [...values.domain], // Add the selected domain to the array
    };
    if (values.domain.includes(modelData.domain)) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You have already applied for this internship.",
      });
      navigate("/dashboard/profile");
      return;
    }
    updatedValues.domain.push(modelData.domain); // Add the selected domain to the array
    fetch(url + "/apply/update/" + applyData._id, {
      method: "PUT",
      body: JSON.stringify(updatedValues),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
          });
        }
        Swal.fire({
          icon: "success",
          title: "Well done!",
          text: "You have successfully applied for this internship.",
        });
        navigate("/dashboard/profile");
      })
      .catch((error) => {
        console.error("Error updating details:", error);
      });
  };

  const getModelById = () => {
    fetch(url + "/service/getbyid/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setModelData(data);
      })
      .catch((error) => {
        console.log("Error fetching internship data:", error);
      });
  };

  useEffect(() => {
    getModelById();
  }, [id]);

  const [selFile, setSelFile] = useState("");

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
        setResumeUrl(fileName);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="footer intern-center" style={{ height: "100%" }}>
      <div>
        {isLoading ? ( // Check loading state
          <div>
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div> // Render loading indicator
        ) : modelData ? (
          <>
            <div class="internship-container ">
              <div class="apply_box">
                <h1>
                  {modelData.domain}
                  <span class="title_small"> ({modelData.duration})</span>
                </h1>
                <Formik
                  initialValues={{
                    ...Apply,
                    ...applyData, // Prepopulate form values with existing data
                  }}
                  validationSchema={validationSchema}
                  onSubmit={addSubmit}
                >
                  {({
                    values,
                    handleSubmit,
                    handleChange,
                    errors,
                    touched,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div class="form_container">
                        <div class="form_control">
                          <label
                            className="internship-label"
                            htmlFor="username"
                          >
                            {" "}
                            Full Name *{" "}
                          </label>
                          <input
                            id="username"
                            name="username"
                            placeholder="Enter Full Name..."
                            value={currentUser.username}
                            readOnly
                            className="internship-input"
                          />
                        </div>
                        <div class="form_control">
                          <label className="internship-label" htmlFor="email">
                            {" "}
                            Email Address *{" "}
                          </label>
                          <input
                            id="email"
                            text="email"
                            name="email"
                            placeholder="Enter Email..."
                            className="internship-input"
                            value={currentUser.email}
                            readOnly
                          />
                        </div>

                        <div class="form_control">
                          <label className="internship-label" htmlFor="number">
                            {" "}
                            Mobile Number *{" "}
                          </label>
                          <input
                            type="number"
                            id="number"
                            name="number"
                            placeholder="Enter Mobile Number..."
                            className="internship-input"
                            value={values.number}
                            onChange={handleChange}
                          />
                          {errors.number && touched.number && (
                            <div className="error">{errors.number}</div>
                          )}
                        </div>

                        <div class="form_control">
                          <label className="internship-label" htmlFor="gender">
                            {" "}
                            Gender *{" "}
                          </label>
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
                          {errors.gender && touched.gender && (
                            <div className="error">{errors.gender}</div>
                          )}
                        </div>

                        <div class="form_control">
                          <label
                            className="internship-label"
                            htmlFor="linkedin"
                          >
                            {" "}
                            Linkedin Profile link{" "}
                          </label>
                          <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            placeholder="Enter Linkedin Profile Link..."
                            className="internship-input"
                            value={values.linkedin}
                            onChange={handleChange}
                          />
                        </div>

                        <div class="form_control">
                          <label className="internship-label" htmlFor="github">
                            Github Link{" "}
                          </label>
                          <input
                            id="github"
                            name="github"
                            placeholder="Enter Github link..."
                            className="internship-input"
                            value={values.github}
                            onChange={handleChange}
                          />
                        </div>
                        <div class="form_control">
                          <label className="internship-label" htmlFor="course">
                            {" "}
                            Choose Qualification{" "}
                          </label>
                          <select
                            className="internship-input"
                            id="course"
                            name="course"
                            value={values.course}
                            onChange={handleChange}
                          >
                            <option value="">Select Choose</option>
                            <option value="BE">BE</option>
                            <option value="btech">BTech</option>
                            <option value="diploma">Diploma</option>
                            <option value="bca">BCA</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div class="form_control">
                          <label className="internship-label" htmlFor="stream">
                            Stream Name
                          </label>
                          <input
                            type="text"
                            id="stream"
                            name="stream"
                            placeholder="Enter your Stream name..."
                            className="internship-input"
                            value={values.stream}
                            onChange={handleChange}
                          />
                        </div>
                        <div class="form_control">
                          <label className="internship-label" htmlFor="college">
                            College Name
                          </label>
                          <input
                            type="text"
                            id="college"
                            name="college"
                            placeholder="Enter your College name..."
                            className="internship-input"
                            value={values.college}
                            onChange={handleChange}
                          />
                        </div>
                        <div class="form_control">
                          <label className="internship-label" htmlFor="year">
                            Passing Year
                          </label>
                          <input
                            type="number"
                            id="year"
                            name="year"
                            placeholder="Enter your Passing Year..."
                            className="internship-input"
                            value={values.year}
                            onChange={handleChange}
                          />
                        </div>
                        <div class="">
                          <label className="internship-label" htmlFor="resume">
                            {" "}
                            Resume{" "}
                          </label>
                          <input
                            type="file"
                            id="resume"
                            name="resume"
                            className="internship-input"
                            onChange={uploadFile}
                          />
                        </div>
                      </div>
                      {errors.resume && touched.resume && (
                        <div className="error">{errors.resume}</div>
                      )}
                      {resumeUrl || applyData?.resume ? (
                        <div className="mt-4" style={{ float: "left" }}>
                          <a
                            href={url+`/util/files/${
                              resumeUrl || applyData?.resume
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                        </div>
                      ) : null}
                      <div class="button_container">
                        <button className="apply-button" type="submit">Apply Now</button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </>
        ) : (
          <div>Data not found</div> // Render error message if modelData is null
        )}
      </div>
    </div>
  );
};

export default InternshipApply;
