import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./ContactDetail.css";
import app_config from "../../config";
const ContactDetail = () => {
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/contact/getall");
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
      const response = await fetch(
        url+`/contact/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contact deleted successfully",
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
      userArray.forEach(({ _id, name, email, subject, message }) => {
        if (emailMap.has(email)) {
          emailMap.get(email).push({ _id, name, email, subject, message });
        } else {
          emailMap.set(email, [{ _id, name, email, subject, message }]);
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
        const { email } = users[0];
        return (
          <div key={email} className="mb-4">
            <h3>{email}</h3>
            <table className="custom-table custom-table-striped custom-table-bordered ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ _id, name, email, subject, message }) => (
                  <tr key={_id}>
                    <td>{name}</td>
                    <td>
                      <a href={`mailto:${email}`} className="custom-email-link">
                        {email}
                      </a>
                    </td>
                    <td>{subject}</td>
                    <td>{message}</td>
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
    <div className="footer contact-container mt-4" style={{height:"100%"}}>
      <h1 className="text-center-custom margin-bottom">Contact Details</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">{displayUsers()}</div>
      </div>
    </div>
  );
};

export default ContactDetail;
