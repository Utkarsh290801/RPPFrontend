import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import app_config from "../../config";
const SignUpForm = ({ onSignUpSuccess }) => {
  const url = app_config.backend_url;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const signup = {
    username: "",
    email: "",
    password: "",
  };
  // const userSubmit = async (formdata) => {
  //   setLoading(true);
  //   console.log(formdata);
  //   const response = await fetch(url + "/user/add", {
  //     method: "POST",
  //     body: JSON.stringify(formdata),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   if (response.status === 200) {
  //     console.log(response.status);
  //     const data = await response.json();
  //     // console.log("data saved");
  //     console.log("success");
  //     const response2 = await fetch(url + "/apply/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ user: data._id }),
  //     });
  //     if (response2.status === 200) {console.log("Apply created");
  //     Swal.fire({
  //       icon: "success",
  //       title: "Well Done",
  //       text: "You have sucessfully registered !! 👍👍",
  //     });
  //     if (typeof onSignUpSuccess === "function") {
  //       onSignUpSuccess(); // Call the callback function on successful signup
  //     }}
  //   } else {
  //     console.log(response.status);
  //     console.log("something went wrong");
  //     Swal.error({
  //       icon: "error",
  //       title: "OOPS",
  //       text: "!! something went wrong!!",
  //     });
  //   }
  //   setLoading(false);
  // };
  const userSubmit = async (formdata) => {
    setLoading(true);
    try {
      const response = await fetch(url + "/user/add", {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const response2 = await fetch(url + "/apply/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: data._id }),
        });

        if (response2.status === 200) {
          // Send email to the registered user
          sendEmail(formdata.email, formdata.username);

          // Display success message
          Swal.fire({
            icon: "success",
            title: "Well Done",
            text: "You have successfully registered!",
          });
          if (typeof onSignUpSuccess === "function") {
            onSignUpSuccess(); // Call the callback function on successful signup
          }
          // Clear form and navigate or perform other actions
          // ...
        } else {
          Swal.fire({
            icon: "error",
            title: "OOPS",
            text: "Something went wrong while creating application.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "OOPS",
          text: "Something went wrong while registering user.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (toEmail, name) => {
    try {
      const response = await fetch(url + "/util/sendmail", {
        method: "POST",
        body: JSON.stringify({
          to: toEmail,
          subject: "Welcome to Right Path Predictor",
          text: `Dear ${name} , \n
  Congratulations! Your account has been successfully created on our internship platform at Right Path Predictor Pvt Ltd. We are thrilled to have you onboard and look forward to supporting you on your journey to acquiring valuable skills and experiences.
  \n 
  Now that your account is active, the next step is to select the domains that interest you and apply for the internships that align with your career aspirations. Our platform offers a wide range of exciting opportunities across various fields, ensuring there's something for everyone.
  \n
  Stay Updated: Keep an eye on your email and the portal for further updates and notifications. We will inform you about the status of your applications and any additional steps if required.
  \n
  We are excited about the possibilities that lie ahead for you and are here to support you every step of the way.
  \n
  Should you have any questions or need assistance during the application process, don't hesitate to reach out to us at rightpathpredictor@gmail.com, internship@rightpathpredictor.in
  \n
  Thank you for choosing Right Path Predictor Pvt Ltd for your internship journey. We believe that this experience will be enriching and rewarding, providing you with a solid foundation for your future career.
  \n
  Happy exploring and best of luck.
  \n
  Best regards,\n
  Skills Developing Network\n
  Right Path Predictor Pvt Ltd`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Email sent successfully to the user");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const formSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too Short username!")
      .max(20, "Too Long username !")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is Required")
      .test("email", "Email already exists", async (value, obj) => {
        // console.log(obj);
        // if(obj.path!=='email') return;
        const response = await fetch(url + "/user/checkemail/" + value);
        if (response.status === 200) {
          // console.log("email found");
          return false;
        } else if (response.status === 404) {
          // console.log("email not found");
          return true;
        } else if (response.status === 402) {
          // console.log("email not found");
          return true;
        }
      }),
    password: Yup.string()
      .required("Password is Required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });
  return (
    <>
      <Formik
        validationSchema={formSchema}
        initialValues={signup}
        onSubmit={userSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <span className="fIcon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              />
            </div>
            <p className="text-warning">
              {errors.username && touched.username && errors.username}
            </p>
            <div className="input-field">
              <span className="fIcon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Email"
              />
            </div>
            <p className="text-warning">
              {errors.email && touched.email && errors.email}
            </p>
            {/* {errors.email && <span className="text-warning">This field is required</span>} */}
            <div className="input-field">
              <span className="fIcon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
              />
            </div>
            <p className="text-warning">
              {errors.password && touched.password && errors.password}
            </p>
            <input
              className="iBtn"
              type="submit"
              value="sign Up"
              disabled={loading}
            />
            {/* <p className="social-text">Or Sign up with social account</p>
            <SocialMedia /> */}
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
