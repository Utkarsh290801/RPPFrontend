import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./ContactDetail.css";
import app_config from "../../config";
const VideoDetail = () => {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = app_config.backend_url;
  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/video/getall");
      if (response.status === 200) {
        const data = await response.json();
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

  const deleteUser = async (id) => {
    try {
      const response = await fetch(url+`/video/delete/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Video deleted successfully",
        });
        getDataFromBackend();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete user",
      });
    }
  };

  useEffect(() => {
    getDataFromBackend();
  }, []);

  const displayUsers = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="custom-spinner text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else {
      const domainMap = new Map();
      userArray.forEach(({ _id, domain, title, description, link }) => {
        if (domainMap.has(domain)) {
          domainMap.get(domain).push({ _id, domain, title, description, link });
        } else {
          domainMap.set(domain, [{ _id, domain, title, description, link }]);
        }
      });

      const domainGroups = Array.from(domainMap.values());

      if (domainGroups.length === 0) {
        // No result found message
        return (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">No Result Found.</h3>
          </div>
        );
      }

      return domainGroups.map((users) => {
        const { domain } = users[0];
        return (
          <div key={domain} className="mb-4">
            <h3>{domain}</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {users.map(({ _id, domain, title, description, link }) => (
                <div key={_id} className="col">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{title}</h5>
                      <p className="card-text">{description}</p>
                      <div className="d-grid gap-2">
                        <a
                          href={link}
                          target="_blank"
                          download
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Watch Video
                        </a>
                        <button
                          className="btn btn-danger mt-2"
                          onClick={() => deleteUser(_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div className="contact-container mt-4">
      <div className="container">
        <h1 className="text-center-custom mb-4">Video Details</h1>
        <div className="row justify-content-center">
          <div className="col-md-9">{displayUsers()}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
