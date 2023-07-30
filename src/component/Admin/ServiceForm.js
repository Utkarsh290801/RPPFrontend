import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Formik } from "formik";
import { TextField, Button } from "@mui/material";
import app_config from "../../config";
const ServiceForm = ({
  updateFormData,
  setShowUpdateForm,
  getDataFromBackend,
}) => {
  const url = app_config.backend_url;
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("admin"))
  );
  const AddInternship = {
    domain: updateFormData ? updateFormData.domain : "",
    location: updateFormData ? updateFormData.location : "",
    duration: updateFormData ? updateFormData.duration : "",
    position: updateFormData ? updateFormData.position : "",
    uploadedBy: currentUser.username,
  };

  const formSchema = Yup.object().shape({
    domain: Yup.string().required("Required"),
    duration: Yup.string().required("Required"),
    position: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
  });

  const updateSubmit = async (formdata) => {
    console.log(formdata);

    const response = await fetch(
      url+`/service/update/${updateFormData._id}`,
      {
        method: "PUT",
        body: JSON.stringify(formdata),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("success");
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User Details updated!!",
      });
      getDataFromBackend();
      setShowUpdateForm(false);
    } else {
      console.log(response.status);
      console.log("something went wrong");
    }
  };

  const addSubmit = async (formdata) => {
    console.log(formdata);

    const response = await fetch(url+"/service/add", {
      method: "POST",
      body: JSON.stringify(formdata),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log(response.status);
      console.log("success");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Internship added Successfully!! 👍👍",
      });
      response.json().then((data) => {
        navigate("/");
      });
    } else {
      console.log(response.status);
      console.log("something went wrong");
      Swal.error({
        icon: "error",
        title: "OOPS",
        text: "!! something went wrong!!",
      });
    }
  };
  const handleCloseForm = () => {
    setShowUpdateForm(false);
  };

  return (
    <div
      className="footer d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="card-body">
                  <h3>
                    {updateFormData ? "Update Internship" : "Create Internship"}
                  </h3>
                  <Formik
                    initialValues={AddInternship}
                    onSubmit={updateFormData ? updateSubmit : addSubmit}
                    validationSchema={formSchema}
                  >
                    {({
                      values,
                      handleSubmit,
                      handleChange,
                      errors,
                      touched,
                    }) => (
                      <form onSubmit={handleSubmit} className="w-100">
                        <fieldset>
                          <TextField
                            label="Domain"
                            id="domain"
                            value={values.domain}
                            onChange={handleChange}
                            className="w-100 mb-4 mt-3"
                            helperText={touched.domain ? errors.domain : ""}
                            error={Boolean(errors.domain && touched.domain)}
                          />

                          <TextField
                            label="Position"
                            id="position"
                            value={values.position}
                            onChange={handleChange}
                            className="w-100 mb-4"
                            helperText={touched.position ? errors.position : ""}
                            error={Boolean(errors.position && touched.position)}
                          />

                          <TextField
                            label="Location"
                            id="location"
                            value={values.location}
                            onChange={handleChange}
                            className="w-100 mb-4"
                            helperText={touched.location ? errors.location : ""}
                            error={Boolean(errors.location && touched.location)}
                          />

                          <TextField
                            label="Duration"
                            id="duration"
                            value={values.duration}
                            onChange={handleChange}
                            className="w-100 mb-4"
                            helperText={touched.duration ? errors.duration : ""}
                            error={Boolean(errors.duration && touched.duration)}
                          />

                          <Button
                            variant="contained"
                            type="submit"
                            className="w-100 mt-4"
                            style={{
                              backgroundColor: "#7355F7",
                              color: "white",
                            }}
                          >
                            <h3>{updateFormData ? "Update" : "Submit"}</h3>
                          </Button>
                          {updateFormData && (
                            <Button
                              variant="contained"
                              className="w-100 mt-3"
                              onClick={handleCloseForm}
                            >
                              <h3>Close</h3>
                            </Button>
                          )}
                        </fieldset>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
