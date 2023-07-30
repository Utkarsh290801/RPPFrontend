import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./ContactDetail.css";
import app_config from "../../config";
const OfferLetterDetail = () => {
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/offer/getall");
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
      const response = await fetch(url+`/offer/delete/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Letter deleted successfully",
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
      const emailMap = new Map();
      userArray.forEach(({ _id, appliedBy, appliedName, letter, domain }) => {
        if (emailMap.has(appliedBy)) {
          emailMap
            .get(appliedBy)
            .push({ _id, appliedBy, appliedName, letter, domain });
        } else {
          emailMap.set(appliedBy, [
            { _id, appliedBy, appliedName, letter, domain },
          ]);
        }
      });
      const emailGroups = Array.from(emailMap.values());

      if (emailGroups.length === 0) {
        // No result found message
        return (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">No Result Found.</h3>
          </div>
        );
      }

      return emailGroups.map((users) => {
        const { appliedBy } = users[0];
        return (
          <div key={appliedBy} className="mb-4">
            <h3>{appliedBy}</h3>
            <table className="custom-table custom-table-striped custom-table-bordered ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Domain</th>
                  <th>Letter</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  ({ _id, appliedBy, appliedName, letter, domain }) => (
                    <tr key={_id}>
                      <td>{appliedName}</td>
                      <td>{appliedBy}</td>
                      <td>{domain}</td>
                      <td>
                        <a
                          href={url+`/util/files/${letter}`}
                          target="_blank"
                          download
                          rel="noopener noreferrer"
                        >
                          {letter}
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
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      });
    }
  };

  return (
    <div className="contact-container mt-4">
      <h1 className="text-center-custom margin-bottom">
        Provided Offer Letter
      </h1>
      <div className="row justify-content-center">
        <div className="col-md-8">{displayUsers()}</div>
      </div>
    </div>
  );
};

export default OfferLetterDetail;
