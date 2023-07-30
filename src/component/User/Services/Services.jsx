import React, { useEffect, useState } from "react";
import "./Service.css"; // Updated CSS file name
import app_config from "../../../config";

const Services = ({ filter }) => {
  const url = app_config.backend_url;
  const [services, setServices] = useState([]);
  const getDataFromBackend = async () => {
    const response = await fetch(url + "/service/getall");
    const data = await response.json();
    setServices(data);
  };
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const handleApply = async (serviceId) => {
    window.location.href = `/user/apply/${serviceId}`;
  };

  useEffect(() => {
    getDataFromBackend();
  }, []);

  const filteredServices = services.filter((service) =>
    service.domain.toLowerCase().includes(filter?.toLowerCase())
  );

  const renderServices = filter ? filteredServices : services;

  return (
    <section id="services" className="services">
      <div className="container">
        <h4 className="miniTitle text-center">Our Internships</h4>
        <div className="text-center">
          <h5 className="text-center sectionTitle">CHOOSE YOUR DOMAIN</h5>
        </div>

        <div className="row p-4">
          {renderServices.length === 0 ? (
            <p className="text-center no-results">No Results Found</p>
          ) : (
            renderServices.map((curr) => (
              <div className="col-md-4 mb-4" key={curr.id}>
                <div className="training-item">
                  <div className="service-image">
                    <img
                      src={url + `/util/files/${curr.logo}`}
                      alt="logo"
                      className="img-fluid"
                    />
                  </div>
                  <div className="service-details">
                    <h3>{curr.domain}</h3>
                    <p className="service-info">
                      Position: <span>{curr.position}</span> <br />
                      Location: <span>{curr.location}</span> <br />
                      Duration: <span>{curr.duration}</span>{" "}
                    </p>
                    <button className="apply-btn" onClick={() => handleApply(curr._id)}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
