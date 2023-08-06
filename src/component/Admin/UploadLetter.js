import React, { useEffect, useState } from "react";
import "./PaymentDetails.css";
import Swal from "sweetalert2";
import { Formik } from "formik";
import app_config from "../../config";

const UploadLetter = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const url = app_config.backend_url;

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/apply/getall");
      if (response.status === 200) {
        const data = await response.json();
        setPaymentData(data);
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

  const fetchOfferData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/offer/getall");
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
    fetchPaymentData();
    fetchOfferData();
  }, []);

  const handleUpload = async (domain, appliedBy, appliedName) => {
    const existingOffer = offerData.find(
      (offer) =>
        offer.appliedBy === appliedBy &&
        offer.domain.includes(domain) &&
        offer.letter !== ""
    );

    if (existingOffer) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You have already uploaded a file for this domain.",
      });
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      console.log(`Upload button clicked for domain: ${domain}`);
      console.log(`Selected file:`, file);

      const formData = new FormData();
      formData.append("myfile", file);

      try {
        const response = await fetch(url + "/util/uploadfile", {
          method: "POST",
          body: formData,
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log("File uploaded successfully");

          const formdata = {
            appliedBy: appliedBy,
            appliedName: appliedName,
            domain: domain,
            letter: data.fileName,
          };

          const addResponse = await fetch(url + "/offer/add", {
            method: "POST",
            body: JSON.stringify(formdata),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (addResponse.status === 200) {
            console.log("Success");
            const emailResponse = await fetch(url + "/util/sendmail", {
              method: "POST",
              body: JSON.stringify({
                to: appliedBy,
                subject: "Internship Offer Letter Available on Right Path Predictor Pvt Ltd Internship Portal",
                text: `Dear ${appliedName},
                
                We are excited to share the news with you! Your internship offer letter is now accessible on the Right Path Predictor Pvt Ltd Internship Portal. Kindly log in to review and acknowledge the offer at your earliest convenience. Congratulations on your selection! We are thrilled to have you join our team.
                
                Here are some important points to keep in mind during your internship tenure:
                
                1. Update your LinkedIn profile and showcase your achievements, including the Offer Letter and Internship Completion Certificate you received from us. Don't forget to tag @rightpathpredictor.in and use hashtags #rpp #rightpathpredictor #startup #internship #rppinternship .
                
                2. Plagiarism is strictly prohibited. Please ensure that your projects and code are original. Any violation of this policy may result in termination of your internship and future opportunities with us.
                
                3. Share a video of your completed tasks on LinkedIn, tagging Right Path Predictor Pvt Ltd @rightpathpredictor.in , and using the hashtag #rpp #rightpathpredictor #startup #internship #rppinternship . A brief explanation of the task is mandatory.
                
                4. If you're participating in a Tech Internship, maintain a separate GitHub repository named "RPP" for all your tasks. Share the repository link in the task submission form, which will be given in internship portal.
                
                5. Complete all tasks and requirements within the specified timeline to ensure a successful internship.

                6. Remember to submit your tasks on time to maximize your learning and contribute to the success of the internship program.
                
                Congratulations once again on your selection. Your dedication and enthusiasm are truly appreciated.
                
                Stay connected with us:
                
                LinkedIn: https://www.linkedin.com/company/right-path-predictor-pvt-ltd
                Telegram: https://t.me/rightpathpredictor
                Instagram: https://www.instagram.com/rightpathpredictor/
                Facebook: https://www.facebook.com/profile.php?id=100088203945476
                Twitter: https://twitter.com/R_P_PREDICTORS
                
                For any queries or assistance, please feel free to contact us:
                
                Email: rightpathpredictor@gmail.com
                Website: https://rightpathpredictor.in
                
                Wishing you a rewarding and enriching internship journey!
                
                Best Regards,
                Team Right Path Predictor
                
               `,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (emailResponse.status === 200) {
              console.log("Email sent successfully");
            } else {
              console.log("Failed to send email");
            }
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Offer Letter Uploaded!! 👍👍",
            });
            fetchOfferData(); // Refresh offer data after successful upload
          } else {
            console.log("Something went wrong");
            Swal.error({
              icon: "error",
              title: "Oops",
              text: "Something went wrong while adding the internship.",
            });
          }
        } else {
          throw new Error("File upload failed");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to upload file",
        });
      }
    });

    input.click();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="latest-transactions">
      <h1>Offer Letter</h1>
      <h2></h2>

      {paymentData.length === 0 ? (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">No Result Found.</h3>
        </div>
      ) : (
        paymentData.map((offer, index) => (
          <React.Fragment key={index}>
            {Array.isArray(offer.domain) && offer.domain.length > 0 ? (
              <details>
                <summary>
                  <div className="transaction-item">
                    <span
                      className="transaction-icon"
                      style={{ backgroundColor: "#f2dcbb" }}
                    >
                      <svg
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
                    </span>
                    <h3>
                      <strong>{offer.appliedName}</strong>
                      <small>{offer.appliedBy}</small>
                    </h3>
                  </div>
                </summary>
                <div>
                  <dl>
                    <div>
                      <dt>Date</dt>
                      <dd>{offer.appliedDate}</dd>
                    </div>
                    <div>
                      <dt>Domain</dt>
                      <dd>
                        <ul className="domain-list">
                          {offer.domain.map((item, index) => (
                            <li key={index}>
                              <span>{item} &nbsp;</span>
                              <button
                                onClick={() =>
                                  handleUpload(
                                    item,
                                    offer.appliedBy,
                                    offer.appliedName
                                  )
                                }
                                className="upload-button"
                              >
                                Upload
                              </button>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>User ID</dt>
                      <dd>{offer.user}</dd>
                    </div>
                    <span></span>
                  </dl>
                </div>
              </details>
            ) : null}
          </React.Fragment>
        ))
      )}
    </section>
  );
};

export default UploadLetter;
