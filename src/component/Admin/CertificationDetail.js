import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import app_config from "../../config";
const CertificationDetail = () => {
  const url = app_config.backend_url;
  const [certificateArray, setCertificateArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/certificate/getall");
      if (response.status === 200) {
        const data = await response.json();
        setCertificateArray(data);
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
        url+`/certificate/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Certificate deleted successfully",
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

  useEffect(() => {
    const filtered = certificateArray.filter((certificate) =>
      certificate.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredCertificates(filtered);
  }, [certificateArray, searchEmail]);

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  return (
    <div>
      <div className="container table-responsive py-5">
        <input
          type="text"
          value={searchEmail}
          onChange={handleSearchChange}
          placeholder="Search by Email"
        />
        {loading ? (
         <div className="col-md text-center mt-5">
         <h3 className="headerTitle">Loading.......</h3>
       </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">No Result Found.</h3>
          </div>
        ) : (
          <table className="table table-bordered table-hover table-striped mt-5">
            <thead className="thead-light">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Domain</th>
                <th scope="col">Certificate</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((certificate, index) => (
                <tr key={certificate._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{certificate.name}</td>
                  <td>{certificate.email}</td>
                  <td>{certificate.domain}</td>
                  <td>
                    <a
                      href={url+`/util/files/${certificate.certificate}`}
                      target="_blank"
                      download
                      rel="noopener noreferrer"
                    >
                      {certificate.certificate}
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn custom-btn-danger ms-2"
                      onClick={() => deleteUser(certificate._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CertificationDetail;
