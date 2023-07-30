import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./ContactDetail.css";
import app_config from "../../config";
const TaskDetail = () => {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = app_config.backend_url;
  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/task/getall");
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
      const response = await fetch(url+`/task/delete/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Task deleted successfully",
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
      userArray.forEach(({ _id, domain, file }) => {
        if (domainMap.has(domain)) {
          domainMap.get(domain).push({ _id, domain, file });
        } else {
          domainMap.set(domain, [{ _id, domain, file }]);
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
            <table className="custom-table custom-table-striped custom-table-bordered ">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Task</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ _id, domain, file }) => (
                  <tr key={_id}>
                    <td>{domain}</td>
                    <td>
                      <a
                        href={url+`/util/files/${file}`}
                        target="_blank"
                        download
                        rel="noopener noreferrer"
                        className="custom-email-link"
                      >
                        {file}
                      </a>
                    </td>

                    <td>
                      <button
                        className="btn custom-btn-danger ms-2"
                        onClick={() => deleteUser(_id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      });
    }
  };

  return (
    <div className="footer contact-container mt-4" style={{ height: "100%" }}>
      <h1 className="text-center-custom margin-bottom">Task Details</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">{displayUsers()}</div>
      </div>
    </div>
  );
};

export default TaskDetail;
