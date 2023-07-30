import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import SocialMedia from "./SocialMedia";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";
import { AppContext } from "../../context/AppContext";
import app_config from "../../config";
const SignInForm = () => {
  const url = app_config.backend_url;
  const { setloggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loginform = {
    email: "",
    password: "",
  };
  const formSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),

    password: Yup.string().required("Required"),
  });
  // ...

  const loginSubmit = async (formdata, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);
    // Check if email exists
    const res = await fetch(url + "/user/checkemail/" + formdata.email);
    if (res.status === 200) {
      // Email exists, proceed with login
      const response = await fetch(url+"/user/authenticate", {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Login success
        console.log(response.status);
        console.log("success");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login Success!!👍",
        });
        const data = await response.json();
        console.log(data);
        setloggedIn(true);
        if (data.isAdmin) {
          sessionStorage.setItem("admin", JSON.stringify(data));
          navigate("/admin/profile");
        } else {
          if (data.isBlocked) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Your account has been blocked by the admin.",
            });
            setSubmitting(false);
            return;
          }
          navigate("/");
          sessionStorage.setItem("user", JSON.stringify(data));
        }
      } else if (response.status === 401) {
        // Authentication failed
        console.log(response.status);
        console.log("authentication failed");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid email or password",
        });
      } else {
        // Other error cases
        console.log(response.status);
        console.log("something went wrong");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Login Failed",
        });
      }
    } else {
      // Email does not exist
      console.log(res.status);
      console.log("email does not exist");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Create Your Account First",
      });
    }
    setSubmitting(false);
    setLoading(false);
  };

  // ...

  return (
    <>
      <Formik
        initialValues={loginform}
        validationSchema={formSchema}
        onSubmit={loginSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form className="sign-in-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign in</h2>

            <div className="input-field">
              <span className="fIcon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                id="email"
                placeholder="Email"
              />
            </div>
            <p className="text-warning">
              {errors.email && touched.email && errors.email}
            </p>
            {/* {errors.email && <span className="text-warning">This field is required</span>} */}
            <div class="input-field">
              <span className="fIcon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
              />
            </div>
            <p className="text-warning">
              {errors.password && touched.password && errors.password}
            </p>
            {/* {errors.password && <span className="text-warning">This field is required</span>} */}
            <p className="social-text ">
              {" "}
              Forgot your password?
              <NavLink to="/reset"> Reset now</NavLink>
            </p>
            <input className="iBtn" type="submit" value="sign In" disabled={loading}/>
            {/* <SocialMedia /> */}
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignInForm;
