import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./PaymentForm.css";
import Swal from "sweetalert2";
import photo from "../../Assets/images/Payment.jpg";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import app_config from "../../config";
const PaymentForm = () => {
  const url = app_config.backend_url;
  const [selectedDomain, setSelectedDomain] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [paymentData, setPaymentData] = useState([]);

  const [appliedStatus, setAppliedStatus] = useState(null);
  const navigate = useNavigate();

  const fetchOfferData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/offer/getall");
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
  const handleScreenshotChange = (e, handleChange) => {
    const file = e.target.files[0];
    setScreenshot(file.name); // Set the file name instead of the file object
    const fd = new FormData();
    fd.append("myfile", file);
    fetch(url + "/util/uploadfile", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded");
      }
    });
  };

  const AddForm = {
    email: currentUser.email,
    domain: "",
    name: currentUser.username,
    screenshot: "",
    createdate: new Date().toLocaleDateString("en-GB"),
  };

  const fetchAppliedStatus = async () => {
    if (currentUser) {
      try {
        const res = await fetch(
          url+`/apply/checkuser/${currentUser._id}`
        );
        const planData = await res.json();
        if (planData) {
          setAppliedStatus(planData.domain);
          // Update available domains
        } else {
          setAppliedStatus([]);
          // Clear available domains
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

  useEffect(() => {
    fetchAppliedStatus();
  }, []);
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/payment/getall");
      if (response.status === 200) {
        const data = await response.json();
        setPaymentData(data);
      } else {
        throw new Error("Failed to fetch payment data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch payment data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);
  const addSubmit = async (formdata, { resetForm }) => {
    const existingPayment = paymentData.find(
      (payment) =>
        payment.email === formdata.email && payment.domain === formdata.domain
    );

    if (existingPayment) {
      Swal.fire({
        icon: "error",
        title: "Payment Already Made",
        text: "You have already made a payment for this domain.",
      });
      return;
    }

    formdata.screenshot = screenshot;
    formdata.createdate = new Date().toLocaleDateString("en-GB");
    try {
      const response = await fetch(url+"/payment/add", {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment Done!! 👍👍",
        });
        setSelectedDomain("");
        setScreenshot(null);
        fetchPaymentData();
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "OOPS",
          text: "Something went wrong!!",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit payment",
      });
    }
  };

  if (appliedStatus === null) {
    return <p>Loading...</p>;
  } else if (Array.isArray(appliedStatus) && appliedStatus.length === 0) {
    return (
      <div className="col-md text-center mt-5">
        <h3 className="headerTitle">
          Please apply for an
          <span className="headerHighlight"> Internship </span>
          to pay the fees.
        </h3>
      </div>
    );
  } else {
    const availableDomains = offerData
      .filter((offer) => offer.appliedBy === currentUser.email)
      .map((offer) => offer.domain);
    if (availableDomains.length === 0) {
      return (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">
            You are not
            <span className="headerHighlight"> Shortlisted </span>
          </h3>
        </div>
      );
    }
    return (
      <div>
        <div className="payment-container ">
          <h2 className="text-center mb-4">Payment Form</h2>
          <Formik initialValues={AddForm} onSubmit={addSubmit}>
            {({ values, handleSubmit, handleChange, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="domainSelect">
                  <Form.Label>Select Domain:</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.domain}
                    onChange={handleChange("domain")}
                    isInvalid={touched.domain && errors.domain}
                  >
                    <option value="">Choose domain...</option>
                    {availableDomains.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.domain}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="qr-code-container">
                  {values.domain && (
                    <>
                      <h3 className="mt-4">{values.domain}</h3>
                      <img src={photo} alt="" className="img-fluid" />
                      <h1>Fees : Rs.99</h1>
                    </>
                  )}
                </div>
                <Form.Group controlId="screenshotUpload">
                  <Form.Label>Upload Payment Screenshot:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleScreenshotChange(e, handleChange)}
                    isInvalid={touched.screenshot && errors.screenshot}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.screenshot}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" disabled={!values.domain || !screenshot}>
                  Submit Payment
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
};

export default PaymentForm;
