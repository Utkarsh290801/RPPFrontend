import React, { useState, useEffect } from "react";
import "./TaskAllocation.css";
import Swal from "sweetalert2";
import app_config from "../../config";
const TaskAllocation = () => {
  const [TaskArray, setTaskArray] = useState([]);
  const [Offerrray, setOfferArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  
  const url = app_config.backend_url;
  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/task/getall");
      if (response.status === 200) {
        const data = await response.json();
        setTaskArray(data);
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

  const getOfferDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/offer/getall");
      if (response.status === 200) {
        const data = await response.json();
        setOfferArray(data);
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
    getOfferDataFromBackend();
  }, []);

  // Filter tasks based on offer received
  const filteredTasks = TaskArray.filter((task) => {
    const offerReceived = Offerrray.some(
      (offer) =>
        offer.appliedBy === currentUser.email && offer.domain === task.domain
    );
    return offerReceived;
  });
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
    <div>
      <div className="container custom-container">
        <div className="custom-download-list-wrap">
          <h3 className="custom-text-center">Allocated Task</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <ul className="list-group custom-download-list">
              {filteredTasks.length === 0 ? (
              <p className="no-tasks-para">No tasks available</p>
              ) : (
                filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="list-group-item custom-download-list-item"
                  >
                    <div className="custom-download-list-icon">
                      <i className="fa-sharp fa-solid fa-file-pdf fa-2x text-danger"></i>
                    </div>
                    <div className="custom-download-list-src">
                      <div className="custom-download-list-name">
                        {task.domain}
                      </div>
                      <div className="custom-download-list-meta">
                        <span className="custom-download-list-ext badge bg-primary">
                          .pdf
                        </span>
                        <span className="custom-download-list-size">1 MB</span>
                      </div>
                    </div>
                    <div className="custom-download-list-btn">
                      <a
                        href={url+`/util/files/${task.file}`}
                        onClick={(e) => handleDownload(e, task.file)}
                        className="btn btn-primary"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAllocation;
