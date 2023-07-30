import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./ContactDetail.css";
import app_config from "../../config";
const SubmissionDetail = () => {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState(null);
  const url = app_config.backend_url;
  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/submission/getall");
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
        url+`/submission/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Submission Data Deleted",
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (domain) => {
    setDomainFilter(domain);
  };

  const clearCategoryFilter = () => {
    setDomainFilter(null);
  };

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
      const filteredUsers = userArray.filter(
        (user) =>
          user.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const domainMap = new Map();
      filteredUsers.forEach(
        ({ _id, name, email, domain, github, linkedin, file, description }) => {
          if (domainMap.has(domain)) {
            domainMap.get(domain).push({
              _id,
              name,
              email,
              domain,
              github,
              linkedin,
              file,
              description,
            });
          } else {
            domainMap.set(domain, [
              { _id, name, email, domain, github, linkedin, file, description },
            ]);
          }
        }
      );

      const domains = Array.from(domainMap.keys());

      // Apply domain filter if set
      let filteredDomainMap = domainMap;
      if (domainFilter) {
        filteredDomainMap = new Map();
        domains
          .filter((domain) => domain === domainFilter)
          .forEach((domain) => {
            filteredDomainMap.set(domain, domainMap.get(domain));
          });
      }

      const filteredDomains = Array.from(filteredDomainMap.keys());

      return (
        <>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by domain or email"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {filteredDomains.length > 0 ? (
            <div className="mb-3">
              <span className="mr-2">Filter by Domain:</span>
              {filteredDomains.map((domain) => (
                <button
                  key={domain}
                  className={`btn btn-sm btn-outline-secondary mr-2 ${
                    domainFilter === domain ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(domain)}
                >
                  {domain}
                </button>
              ))}
              {domainFilter && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearCategoryFilter}
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : null}
          {filteredDomainMap.size > 0 ? (
            Array.from(filteredDomainMap.entries()).map(([domain, users]) => (
              <div key={domain} className="mb-4">
                <h3>{domain}</h3>
                <table className="table table-striped table-bordered table-light">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Github</th>
                      <th>Linkedin</th>
                      <th>Description</th>
                      <th>Screenshots</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(
                      ({
                        _id,
                        name,
                        email,
                        domain,
                        github,
                        linkedin,
                        file,
                        description,
                      }) => (
                        <tr key={_id}>
                          <td>{domain}</td>
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>
                            <a
                              href={github}
                              className="custom-email-link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {github}
                            </a>
                          </td>
                          <td>
                            <a
                              href={linkedin}
                              className="custom-email-link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {linkedin}
                            </a>
                          </td>
                          <td>{description}</td>
                          <td>
                            <a
                              href={url+`/util/files/${file}`}
                              target="_blank"
                              download
                              rel="noopener noreferrer"
                            >
                              View Resume
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
            ))
          ) : (
            <>
              <div className="col-md text-center mt-5">
                <h3 className="headerTitle">
                  No
                  <span className="headerHighlight"> Result </span>
                  Found.
                </h3>
              </div>
            </>
          )}
        </>
      );
    }
  };

  return (
    <div className="contact-container mt-4">
      <h1 className="text-center-custom margin-bottom">
        Intern Submission Details
      </h1>
      <div className="row justify-content-center">
        <div className="col-md">{displayUsers()}</div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
