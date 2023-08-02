import React from "react";
import { Col, Row } from "react-bootstrap";
import "./Contact.css";
import contactImg from "../../../Assets/images/contact.svg";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";
import app_config from "../../../config";
const Contact = () => {
  const url = app_config.backend_url;
  const userForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  // const contactSubmit = async (formdata, { setSubmitting, resetForm }) => {
  //   console.log(formdata);
  //   setSubmitting(true);

  //   // asynchronous function returns promise
  //   const response = await fetch(url+"/contact/add", {
  //     method: "POST",
  //     body: JSON.stringify(formdata),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (response.status === 200) {
  //     console.log(response.status);
  //     console.log("data saved");
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "send successfully!!",
  //     });
  //     resetForm({ values: "" });
  //   } else if (response.status === 500) {
  //     console.log(response.status);
  //     console.log("something went wrong");
  //     Swal.error({
  //       icon: "error",
  //       title: "OOPS",
  //       text: "!! something went wrong!!",
  //     });
  //   }
  //   setSubmitting(false);
  // };
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   event.target.reset();

  // };
  const recipientEmail = "support@rightpathpredictor.in"; // Replace with the admin's email

  const contactSubmit = async (formdata, { setSubmitting, resetForm }) => {
    console.log(formdata);
    setSubmitting(true);

    // Asynchronous function returns promise
    const response = await fetch(url + "/contact/add", {
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
        text: "send successfully!!",
      });
      resetForm({ values: "" });

      // Send the response email to the user
      fetch(url + "/util/sendmail", {
        method: "POST",
        body: JSON.stringify({
          to: formdata.email, // Use the user's email from the contact form
          subject: "Response to your query",
          text: "Thank you for reaching out to us. We have received your query and will get back to you shortly.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            console.log("Response sent successfully to the user");
          }
          return res.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // Send the details to the admin's email
      fetch(url + "/util/sendmail", {
        method: "POST",
        body: JSON.stringify({
          to: recipientEmail, // Use the admin's email
          subject: "New Contact Form Submission",
          text: `New contact form submission details:\nName: ${formdata.name}\nEmail: ${formdata.email}\nSubject: ${formdata.subject}\nMessage: ${formdata.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            console.log("Details sent successfully to the admin");
          }
          return res.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
  const contactSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(22, "Too Long!")
      .required("*Name is Required"),
    email: Yup.string()
      .email("Email is invalid")
      .required("*Email is required"),
    message: Yup.string()
      .min(12, "Too Short!")
      .max(222, "Too Long!")
      .required("*Message is Required"),
  });
  return (
    <section id="contact">
      <Col md={11} className="mx-auto">
        <Row>
          <Col md={6}>
            <Formik
              initialValues={userForm}
              onSubmit={contactSubmit}
              validationSchema={contactSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} className="contactForm">
                  <h4 className="miniTitle">CONTACT US</h4>
                  <h5 className="sectionTitle">GET IN TOUCH</h5>
                  <Row>
                    <Col md={12} lg={6}>
                      <input
                        placeholder="Your Name"
                        type="text"
                        required
                        id="name"
                        onChange={handleChange}
                        value={values.name}
                      />
                      <p className="text-warning">
                        {errors.name && touched.name && errors.name}
                      </p>
                    </Col>
                    <Col md={12} lg={6}>
                      <input
                        placeholder="Your Email"
                        type="email"
                        required
                        id="email"
                        onChange={handleChange}
                        value={values.email}
                      />
                      <p className="text-warning">
                        {errors.email && touched.email && errors.email}
                      </p>
                    </Col>
                    <Col md={12}>
                      <input
                        placeholder="Subject"
                        type="text"
                        required
                        id="subject"
                        onChange={handleChange}
                        value={values.subject}
                      />
                      <p className="text-warning">
                        {errors.subject && touched.subject && errors.subject}
                      </p>
                    </Col>
                    <Col md={12}>
                      <textarea
                        placeholder="Your Message..."
                        required
                        id="message"
                        type="text"
                        onChange={handleChange}
                        value={values.message}
                      ></textarea>
                      <p className="text-warning">
                        {errors.message && touched.message && errors.message}
                      </p>
                    </Col>
                  </Row>
                  <button className="branBtn" type="submit">
                    Submit Now
                  </button>
                </form>
              )}
            </Formik>
          </Col>
          <Col md={6}>
            <img src={`${contactImg}`} alt="" className="img-fluid" />
          </Col>
        </Row>
      </Col>
    </section>
  );
};

export default Contact;
