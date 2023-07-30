import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import app_config from "../../config";
const Certificate = () => {
  const url = app_config.backend_url;
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const [appliedStatus, setAppliedStatus] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const fetchOfferData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/offer/getall");
      if (response.status === 200) {
        const data = await response.json();
        setOfferData(data);
        console.log(data);
      } else {
        throw new Error("Failed to fetch offer data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch offer data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferData();
  }, []);

  const fetchAppliedStatus = async () => {
    if (currentUser) {
      try {
        const res = await fetch(
          url+`/apply/checkuser/${currentUser._id}`
        );
        const planData = await res.json();
        if (planData) {
          setAppliedStatus(planData.domain);
        } else {
          setAppliedStatus("Not found");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error!!",
          text: "Something went wrong!",
        });
      }
    }
  };

  useEffect(() => {
    fetchAppliedStatus();
  }, [currentUser]);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/payment/getall");
      if (response.status === 200) {
        const data = await response.json();
        setPaymentData(data);
      } else {
        throw new Error("Failed to fetch payment data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch payment data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchCertificateData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/certificate/getall");
      if (response.status === 200) {
        const data = await response.json();
        setCertificateData(data);
      } else {
        throw new Error("Failed to fetch certificate data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch certificate data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateData();
  }, []);
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
  if (appliedStatus === null) {
    return <p>Loading...</p>;
  } else if (Array.isArray(appliedStatus) && appliedStatus.length === 0) {
    return (
      <div className="col-md text-center mt-5">
        <h3 className="headerTitle">
          Please apply for an
          <span className="headerHighlight"> Internship </span>
          to get a certificate.
        </h3>
      </div>
    );
  } else {
    const offersForCurrentUser = offerData.filter(
      (offer) => offer.appliedBy === currentUser.email
    );

    if (offersForCurrentUser.length === 0) {
      return (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">
            You are not <span className="headerHighlight"> Shortlisted. </span>
          </h3>
        </div>
      );
    } else {
      const paymentDataForCurrentUser = paymentData.filter(
        (payment) => payment.email === currentUser.email
      );

      if (paymentDataForCurrentUser.length === 0) {
        return (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">
              Please make the <span className="headerHighlight"> Payment </span>
              to receive the certificate.
            </h3>
          </div>
        );
      } else {
        const certificateDataForCurrentUser = certificateData.filter(
          (certificate) => certificate.email === currentUser.email
        );

        if (certificateDataForCurrentUser.length === 0) {
          return (
            <div className="col-md text-center mt-5">
              <h3 className="headerTitle">
                Certificate is{" "}
                <span className="headerHighlight">not issued </span>nyet.
              </h3>
            </div>
          );
        } else {
          // Render the certificate details and download button
          return (
            <div className="offerletter-container">
              <div className="custom-container">
                <h1>Internship Certificate</h1>
                {certificateDataForCurrentUser.map((certificate, index) => (
                  <div key={index} className="item">
                    <svg
                      className="svg-custom"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth="1.25"
                      width={24}
                      height={24}
                    >
                      <defs>
                        <style
                          dangerouslySetInnerHTML={{
                            __html:
                              ".cls-637647fac3a86d32eae6f200-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}",
                          }}
                        />
                      </defs>
                      <polyline
                        className="cls-637647fac3a86d32eae6f200-1"
                        points="9.14 15.82 6.27 12.96 9.14 10.09"
                      />
                      <polyline
                        className="cls-637647fac3a86d32eae6f200-1"
                        points="14.86 15.82 17.73 12.96 14.86 10.09"
                      />
                      <line
                        className="cls-637647fac3a86d32eae6f200-1"
                        x1="12.95"
                        y1="10.09"
                        x2="11.05"
                        y2="15.82"
                      />
                      <polygon
                        className="cls-637647fac3a86d32eae6f200-1"
                        points="20.59 6.27 20.59 22.5 3.41 22.5 3.41 1.5 15.82 1.5 20.59 6.27"
                      />
                      <polygon
                        className="cls-637647fac3a86d32eae6f200-1"
                        points="20.59 6.27 20.59 7.23 14.86 7.23 14.86 1.5 15.82 1.5 20.59 6.27"
                      />
                    </svg>
                    <div className="filename">
                      <p>{certificate.domain}</p>
                      <div className="filedata">
                        <span>1 file</span>
                        <span>●</span>
                        <span>2 MB</span>
                      </div>
                    </div>
                    <button
                      className="custom-button"
                      onClick={(e) => handleDownload(e, certificate.certificate)}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }
    }
  }
};

export default Certificate;
