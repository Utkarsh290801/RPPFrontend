import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ServiceForm from "./ServiceForm";
import app_config from "../../config";
const ViewDomainList = () => {
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState(null);

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/service/getall");
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

  const updateUser = (user) => {
    console.log(user);
    setUpdateFormData(user);
    setShowUpdateForm(true);
  };

  const deleteUser = async (id) => {
    console.log(id);
    try {
      const response = await fetch(
        url+`/service/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Deleted successfully",
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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else if (userArray.length === 0) {
      return (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">No Result Found.</h3>
        </div>
      );
    } else {
      return userArray.map(({ _id, domain, location, duration, position }) => (
        <tr key={_id}>
          <td>{domain}</td>
          <td>
            <button
              className="btn btn-primary"
              onClick={(e) =>
                updateUser({ _id, domain, location, duration, position })
              }
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={(e) => deleteUser(_id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      ));
    }
  };

  return (
    <div className="container mt-4" style={{ height: "100vh" }}>
      <h1 className="text-center mb-4">Internship Domain</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-dark">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{displayUsers()}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showUpdateForm && (
        <div className="col-md">
          <ServiceForm
            updateFormData={updateFormData}
            setShowUpdateForm={setShowUpdateForm}
            getDataFromBackend={getDataFromBackend}
          />
        </div>
      )}
    </div>
  );
};

export default ViewDomainList;
