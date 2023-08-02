import {
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { useState } from "react";

import Swal from "sweetalert2";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import app_config from "../../config";
const ResetPassword = () => {
  const [passVisible, setPassVisible] = useState(false);
  const theme = createTheme({
    palette: {
      primary: {
        main: "#007bff", // Your primary color
      },
      secondary: {
        main: "#dc3545", // Your secondary color
      },
    },
  });

  const [email, setEmail] = useState("");
  const url = app_config.backend_url;
  const [otp, setOTP] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const generateOTP = () => {
    let tempOtp = Math.floor(1000 + Math.random() * 9000);
    // let tempOtp = parseInt(Math.random().toFixed(4).substr(`-${4}`));
    setOTP(tempOtp);
    return tempOtp;
  };

  const passwordForm = {
    otp: "",
    password: "",
    confirm: "",
  };

  const sendOTP = () => {
    const tempOtp = generateOTP();
    fetch(url + "/util/sendmail", {
      method: "POST",
      body: JSON.stringify({
        to: email,
        subject: "Password Reset",
        // text: "This is your OTP for password reset " + generateOTP(),
        text: "This is your OTP for password reset " + tempOtp,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res.status);
      console.log(otp);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "success",
          text: "OTP Sent Successfully",
        });
      }
      return res.json();
    });
  };

  const verifyUser = () => {
    fetch(url + "/user/getbyemail/" + email)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (!data) {
          console.log("not found!!");
          Swal.fire({
            icon: "error",
            title: "Email not registered!!",
          });
        } else {
          setCurrentUser(data);
          setShowReset(true);
          sendOTP();
        }
      });
  };

  const verifyOTP = (formdata) => {
    if (otp.toString() === formdata.otp.toString()) {
      console.log("otp matched");
      resetPassword(formdata);
    } else {
      console.log("otp not matched");
      Swal.fire({
        icon: "error",
        title: "failed",
        text: "Enter Correct OTP",
      });
    }
  };

  const resetPassword = ({ password }) => {
    fetch(url + "/user/update/" + currentUser._id, {
      method: "PUT",
      body: JSON.stringify({ password: password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log("reset");
        if (res.status === 200)
          Swal.fire({
            icon: "success",
            title: "Password Reset Success!!",
          }).then(() => {
            navigate("/login");
          });
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Password is Required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password Confirmation is Required"),
  });

  const showResetForm = () => {
    if (showReset) {
      return (
        <Card className="reset-form" align="center">
          <CardContent align="center">
            <Formik
              initialValues={passwordForm}
              onSubmit={verifyOTP}
              // onSubmit={(values) => verifyOTP(values, otp)}
              validationSchema={validationSchema}
            >
              {({ values, handleSubmit, handleChange, errors }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    className="w-100 mt-3"
                    placeholder="Enter OTP recieved in Email"
                    label="Enter OTP"
                    variant="outlined"
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                  />
                  <TextField
                    className="w-100 mt-3"
                    placeholder="Enter New Password"
                    label="Password"
                    variant="outlined"
                    id="password"
                    type={passVisible ? "text" : "password"}
                    value={values.password}
                    error={Boolean(errors.password)}
                    helperText="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility1"
                            onClick={(e) => {
                              setPassVisible(!passVisible);
                            }}
                            edge="end"
                          >
                            {passVisible ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className="w-100 mt-3"
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    variant="outlined"
                    id="confirm"
                    type="password"
                    value={values.confirm}
                    error={errors.confirm}
                    helperText={Boolean(errors.confirm)}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility1"
                            onClick={(e) => {
                              setPassVisible(!passVisible);
                            }}
                            edge="end"
                          >
                            {passVisible ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    color="primary"
                    variant="contained"
                    className="mt-5"
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
          </CardContent>
        </Card>
      );
    }
  };
  // const validationSchema = Yup.object().shape({
  //   email: Yup.string().email("Invalid email").required("Email is Required")
  // });

  return (
    <>
      <ThemeProvider theme={theme}>
        {" "}
        <div className="footer reset-container ">
          <div className="reset-header">
            <Link to="/">
              <span className="pageCloseBtn">
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </Link>
          </div>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card
                className="email-card"
                sx={{ width: "100%", maxWidth: 451 }}
              >
                <CardContent align="center">
                  <TextField
                    className="w-100 mt-3"
                    placeholder="Enter Your Email"
                    label="Email"
                    variant="outlined"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button
                    color="success"
                    variant="contained"
                    className="mt-5"
                    type="submit"
                    fullWidth
                    onClick={verifyUser}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {showResetForm()}
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </>
  );
};

export default ResetPassword;
