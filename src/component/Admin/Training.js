import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import app_config from "../../config";
const AddShow = () => {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = app_config.backend_url;
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState("");
  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/service/getall");
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUserArray(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataFromBackend();
  }, []);
  const addSubmit = async (formdata) => {
    console.log(formdata);

    const response = await fetch(url + "/video/add", {
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
        text: "Video Added Successfully!! 👍👍",
      });
      response.json().then((data) => {
        // navigate("/trainingdetail");
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
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h1 className="text-center mb-4">Add your Training Video</h1>
          <div className="row g-0">
            <div className="col-md-6 d-flex align-items-center">
              <img
                id="beauti"
                src="https://img.freepik.com/premium-vector/young-happy-male-reader-student-standing-holding-stack-books-isolated-white-background-smiling-modern-man-studying-preparing-exam-flat-vector-illustration_198278-13474.jpg"
                className="img-fluid rounded-start"
                alt="video"
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <Formik
                initialValues={{
                  // domain: "",
                  title: "",
                  description: "",
                  link: "",
                }}
                onSubmit={addSubmit}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="w-100">
                    {/* <TextField
                      label="Domain"
                      variant="outlined"
                      placeholder="Enter Domain"
                      className="mb-3"
                      fullWidth
                      name="domain"
                      value={values.domain}
                      onChange={handleChange}
                    /> */}

                    <Select
                      label="Domain"
                      variant="outlined"
                      className="mb-3"
                      fullWidth
                      placeholder="Enter Domain"
                      name="domain"
                      value={selectedDomain}
                      onChange={(event) =>
                        setSelectedDomain(event.target.value)
                      }
                    >
                      {/* Populate options from the userArray */}
                      {userArray.map((user) => (
                        <MenuItem key={user.id} value={user.domain}>
                          {user.domain}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      label="Title"
                      variant="outlined"
                      className="mb-3"
                      placeholder="Enter title"
                      fullWidth
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      className="mb-3"
                      placeholder="Enter description"
                      fullWidth
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Video URL"
                      variant="outlined"
                      className="mb-3"
                      placeholder="Enter URL"
                      fullWidth
                      name="link"
                      value={values.link}
                      onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" fullWidth>
                      Submit
                    </Button>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShow;
