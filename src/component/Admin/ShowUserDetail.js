import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MDBCardImage } from "mdb-react-ui-kit";
import { Switch } from "@mui/material";
import app_config from "../../config";
const ShowUserDetail = ({
  selUser,
  setShowUpdateForm,
  deleteUser,
  setShowUserDetailText,
  changeStatusOfUser,
  internshipData,
}) => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(selUser.isAdmin);
  const [isBlocked, setIsBlocked] = useState(selUser.isBlocked);
  const url = app_config.backend_url;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const response = await fetch(url + "/user/getall");
      const data = await response.json();

      console.log(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    setShowUpdateForm(false);
    setShowUserDetailText(true);
  };

  const handleAdminSwitchChange = async (e) => {
    const newAdminStatus = e.target.checked;
    setIsAdmin(newAdminStatus);
    changeStatusOfUser(selUser._id, newAdminStatus, isBlocked);
  };

  const handleBlockedSwitchChange = async (e) => {
    const newBlockedStatus = e.target.checked;
    setIsBlocked(newBlockedStatus);
    changeStatusOfUser(selUser._id, isAdmin, newBlockedStatus);
  };
  useEffect(() => {
    setIsAdmin(selUser.isAdmin); // Update the isAdmin state when selUser changes
    setIsBlocked(selUser.isBlocked);
  }, [selUser]);
  const handleDownload = (e, fileName) => {
    e.preventDefault();
    fetch(url+`/util/files/${fileName}`)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL object to generate the download link
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // Set the filename for the download
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <section className="h-100 gradient-custom-2 mt-4">
      <h1 className="card-title">User Details</h1>
      <hr></hr>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div
            className="rounded-top text-white d-flex flex-row"
            style={{ backgroundColor: "#000", height: 200 }}
          >
            <div
              className="ms-4 mt-5 d-flex flex-column"
              style={{ width: 150 }}
            >
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                alt="Generic placeholder image"
                className="img-fluid img-thumbnail mt-4 mb-2"
                style={{ width: 150, zIndex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-danger"
                data-mdb-ripple-color="dark"
                style={{ zIndex: 1 }}
                onClick={(e) => deleteUser(selUser._id)}
              >
                Delete Account
              </button>
            </div>
            <div className="ms-3" style={{ marginTop: 110 }}>
              <h1>{selUser.username}</h1>
              <p>UserId: {selUser._id}</p>
            </div>
          </div>
          <div
            className="p-4 text-black"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="float-end text-center py-1">
              <div>
                {" "}
                <p className="small text-muted mb-0">
                  <b>Created At:</b> {selUser.createdAt}
                </p>
              </div>
              <div className="d-flex justify-content-around align-items-center">
                <div>
                  <Switch
                    checked={isAdmin}
                    onChange={handleAdminSwitchChange}
                  />
                  <p className="small text-muted mb-0">
                    <b>Admin: </b> {isAdmin ? "Yes" : "No"}
                  </p>
                </div>
                <div className="">
                  <Switch
                    checked={isBlocked}
                    onChange={handleBlockedSwitchChange}
                  />
                  <p className="small text-muted mb-0 ">
                    <b>Blocked: </b> {isBlocked ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {internshipData
            .filter((data) => data.user === selUser._id)
            .map((data) => (
              <div className="card-body p-4 text-black" key={data._id}>
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Full Name</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{selUser.username}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">E-mail</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{selUser.email}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Mobile Number</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.number}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Password</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{selUser.password}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Gender</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.gender}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Applied Domain: </p>
                      </div>
                      <div className="col-sm-9">
                        <ul className="list-unstyled">
                          {data.domain.map((domainItem) => (
                            <li key={domainItem}>{domainItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">College </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.college}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Course </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.course}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Stream </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.stream}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Github Profile </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">
                          {" "}
                          <a
                            href={data.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data.github}
                          </a>
                        </p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Linkedin Profile </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">
                          {" "}
                          <a
                            href={data.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data.linkedin}
                          </a>
                        </p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Passing Year </p>
                      </div>
                      <div className="col-sm-9">
                        <p className="font-italic mb-0">{data.year}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Resume </p>
                      </div>
                      <div className="col-sm-9 d-flex justify-content-around">
                        <p className="font-italic mb-0">
                          {" "}
                          <a
                            href={url+`/util/files/${data.resume}`}
                            target="_blank"
                            download
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                        </p>
                        <a
                          href={url+`/util/files/${data.resume}`}
                          onClick={(e) => handleDownload(e, data.resume)}
                        >
                          Download Resume
                        </a>
                      </div>
                    </div>
                    <hr></hr>
                    <button
                      onClick={handleCancel}
                      color="error"
                      variant="contained"
                      className="w-100 mt-3"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ShowUserDetail;
