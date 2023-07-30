import React, { useEffect, useState } from "react";
import "./Offerletter.css";
import Swal from "sweetalert2";
import app_config from "../../config";
const Offerletter = () => {
  const url = app_config.backend_url;
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState([]);
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

  const offersForCurrentUser = offerData.filter(
    (offer) => offer.appliedBy === currentUser.email
  );

  return (
    <div className="offerletter-container">
      <div className="custom-container">
        {offersForCurrentUser.length > 0 ? (
          <>
            <h1>Your Offer Letters</h1>
            {offersForCurrentUser.map((offer) => (
              <div className="item" key={offer._id}>
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
                  <p>{offer.domain}</p>
                  <div className="filedata">
                    <span>1 file</span>
                    <span>●</span>
                    <span>2 MB</span>
                  </div>
                </div>

                <a
                  className="custom-button"
                  href={url+`/util/files/${offer.letter}`}
                  onClick={(e) => handleDownload(e, offer.letter)}
                >
                  Download
                </a>
              </div>
            ))}
          </>
        ) : (
          <div className="col-md text-center">
            <h3 className="headerTitle">
              You have not received
              <span className="headerHighlight"> any Offer Letter </span>
              yet.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offerletter;
