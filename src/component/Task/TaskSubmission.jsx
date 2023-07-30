import React, { useEffect, useState } from "react";
import { Form, Col, Row, Toast } from "react-bootstrap";
import "./TaskSubmission.css";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import app_config from "../../config";
const TaskSubmission = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const url = app_config.backend_url;
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const [appliedStatus, setAppliedStatus] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const taskSubmission = {
    name: currentUser.username,
    email: currentUser.email,
    domain: "",
    github: "",
    linkedin: "",
    description: "",
    file: selectedFile,
  };
  const fetchOfferData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/offer/getall");
      if (response.status === 200) {
        const data = await response.json();
        setOfferData(data);
        console.log(data);
      } else {
        throw new Error("Failed to fetch offer data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch offer data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferData();
  }, []);
  const SubmissionForm = async (formdata, { setSubmitting, resetForm }) => {
    console.log(formdata);
    formdata.domain = selectedDomain;
    formdata.file = selectedFile;
    setSubmitting(true);
    console.log(currentUser._id);
    // asynchronous function returns promise
    const response = await fetch(url + "/submission/add", {
      method: "POST",
      body: JSON.stringify(formdata),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      console.log(response.status);
      console.log("data saved");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Submit successfully!!",
      });
      navigate("/dashboard/payment");
      resetForm({ values: "" });
    } else if (response.status === 500) {
      console.log(response.status);
      console.log("something went wrong");
      Swal.error({
        icon: "error",
        title: "OOPS",
        text: "!! something went wrong!!",
      });
    }
    setSubmitting(false);
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
        setSelectedFile(fileName); // Assuming the response contains the file name
      })
      .catch((err) => {
        console.error(err);
      });
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

 
  const renderForm = () => {
    const offersForCurrentUser = offerData.filter(
      (offer) => offer.appliedBy === currentUser.email
    );
    if (offersForCurrentUser.length === 0) {
      if (appliedStatus === null) {
        return <p>Loading...</p>;
      } else if (Array.isArray(appliedStatus) && appliedStatus.length === 0) {
        return (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">
              Please apply for an
              <span className="headerHighlight"> Internship </span>
              to submit the task.
            </h3>
          </div>
        );
      }
    }
    const currentUserHasOffer = offersForCurrentUser.length > 0;

    if (currentUserHasOffer) {
      return (
        <>
          <Formik
            initialValues={taskSubmission}
            onSubmit={SubmissionForm}
            // validationSchema={SubmissionSchema}
          >
            {({ values, handleSubmit, handleChange, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mt-4">
                  <Col md={6} xs={12}>
                    {appliedStatus !== null ? (
                      Array.isArray(appliedStatus) &&
                      appliedStatus.length > 0 ? (
                        <div>
                          <Form.Label style={{ fontWeight: "bold" }}>
                            Internship Domain
                          </Form.Label>
                          <select
                            className="form-select"
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            name="domain"
                            required
                          >
                            <option value="">Select a domain</option>
                            {offersForCurrentUser.map((offer, index) => (
                              <option key={index} value={offer.domain}>
                                {offer.domain}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p>Applied Status: Not applied</p>
                      )
                    ) : (
                      <p>Loading...</p>
                    )}

                    <Form.Group>
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Certificate Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your Full Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        readOnly
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Email
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Email Address"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        readOnly
                      />
                    </Form.Group>

                    {/* <Form.Group>
                <Form.Label style={{ fontWeight: "bold" }}>Address</Form.Label>
                <Form.Control type="text" placeholder="Address" />
              </Form.Group> */}
                  </Col>
                  <Col md={6} xs={12}>
                    <div>
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Linkedin Post
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Linkedin Link"
                        name="linkedin"
                        value={values.linkedin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mt-1">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Github Repository Link
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Github Link"
                        name="github"
                        value={values.github}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mt-1">
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Project Screenshots
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Screenshots"
                        name="file"
                        onChange={uploadFile}
                      />
                    </div>
                  </Col>
                </Row>
                <Form.Group as={Col} md={12}>
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Description *(Optional)
                  </Form.Label>
                  <Form.Control
                    style={{ height: "5rem" }}
                    type="text"
                    as="textarea"
                    placeholder="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="text-center">
                  <button className="mainBtn mt-4" type="submit">
                    Submit Task
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      );
    } else {
      return (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">
            You are not
            <span className="headerHighlight"> Shortlisted </span>
          </h3>
        </div>
      );
    }
  };

  return (
    <>
      {/* <Row>
          <Col md={6} xs={12} className="my-3"></Col>
          <Col md={6} xs={12} className="my-3">
            <Form.Label style={{ fontWeight: "bold" }}>Price</Form.Label>
            <div className="priceInput">99</div>
          </Col>
        </Row> */}
      <div className="bookForm">
        <div className="text-center">
          <h1>Task Submission</h1>
        </div>
        {renderForm()}
      </div>
    </>
  );
};

export default TaskSubmission;
