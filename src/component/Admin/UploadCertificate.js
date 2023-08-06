import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import app_config from "../../config";
const UploadCertificate = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = app_config.backend_url;
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/payment/getall");
      if (response.status === 200) {
        const data = await response.json();
        setPaymentData(data);
        console.log(data);
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

  const fetchCertificateData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/certificate/getall");
      if (response.status === 200) {
        const data = await response.json();
        setCertificateData(data);
        console.log(data);
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
    fetchPaymentData();
    fetchCertificateData();
  }, []);

  const handleUpload = async (domain, name, email) => {
    const existingCertificate = certificateData.find(
      (certificate) =>
        certificate.email === email &&
        certificate.domain.includes(domain) &&
        certificate.certificate !== ""
    );

    if (existingCertificate) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You have already uploaded a certificate for this domain.",
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
            name: name,
            email: email,
            domain: domain,
            certificate: data.fileName,
          };

          const addResponse = await fetch(url + "/certificate/add", {
            method: "POST",
            body: JSON.stringify(formdata),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (addResponse.status === 200) {
            const emailResponse = await fetch(url + "/util/sendmail", {
              method: "POST",
              body: JSON.stringify({
                to: email,
                subject: "Internship Certificate Issuance",
                text: `Dear ${name},

                We are delighted to inform you that your internship certificate is now accessible on the Right Path Predictor Internship Portal dashboard. Congratulations on successfully completing your internship!
                
                Login to the portal www.learnwith.rightpathpredictor.in to download your certificate. Your hard work and dedication throughout the internship have paid off.
                
                **Ways to share your achievement:**
                
                1. **Add to Your LinkedIn Profile:** Include your Student Internship Program Certificate directly on your LinkedIn profile.
                2. **Print and Share:** Download the PDF to print and share a physical copy.
                3. **Share on Social Media:** Post on social media platforms or your LinkedIn Feed and tag Right Path Predictor.
                   Tag: @rightpathpredictor.in
                
                Don't forget to use hashtags: #rpp #rightpathpredictor #startup #internship #rppinternship when sharing your Completion Certificate.
                
                Once again, congratulations on your remarkable achievement! 🎉
                
                Thank you for your interest in the Internship Program. We wish you all the best for your future endeavors. If you have any questions or queries, please feel free to contact us:
                
                Email: rightpathpredictor@gmail.com
                Website: https://rightpathpredictor.in/
                
                Keep up the great work!
                
                Best regards,
                Right Path Predictor Pvt Ltd`,
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
              text: "Certificate Uploaded!! 👍👍",
            });
            fetchCertificateData(); // Refresh certificate data after successful upload
          } else {
            console.log("Something went wrong");
            Swal.fire({
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

  if (paymentData.length === 0) {
    return (
      <div className="col-md text-center mt-5">
        <h3 className="headerTitle">No Result Found.</h3>
      </div>
    );
  }

  return (
    <div>
      <section className="latest-transactions">
        <h1>Internship Certificate</h1>
        <h2></h2>

        {paymentData.map((certificate, index) => (
          <React.Fragment key={index}>
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
                              ".cls-637647fac3a86d32eae6f210-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}",
                          }}
                        />
                      </defs>
                      <path
                        className="cls-637647fac3a86d32eae6f210-1"
                        d="M16.77,13.74a2.62,2.62,0,0,0-2.54-2.69,2.53,2.53,0,0,0-2.12,1.2A2.5,2.5,0,0,0,10,11.05a2.62,2.62,0,0,0-2.54,2.69c0,3.15,4.66,4.94,4.66,4.94S16.77,16.89,16.77,13.74Z"
                      />
                      <polygon
                        className="cls-637647fac3a86d32eae6f210-1"
                        points="20.59 6.27 20.59 22.5 3.41 22.5 3.41 1.5 15.82 1.5 20.59 6.27"
                      />
                      <polygon
                        className="cls-637647fac3a86d32eae6f210-1"
                        points="20.59 6.27 20.59 7.23 14.86 7.23 14.86 1.5 15.82 1.5 20.59 6.27"
                      />
                    </svg>
                  </span>
                  <h3>
                    <strong>{certificate.name}</strong>
                    <small>{certificate.email}</small>
                  </h3>
                </div>
              </summary>
              <div>
                <dl>
                  <div>
                    <dt>Date</dt>
                    <dd>{certificate.createdate}</dd>
                  </div>
                  <div>
                    <dt>Domain</dt>
                    <dd>{certificate.domain}</dd>
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        handleUpload(
                          certificate.domain,
                          certificate.name,
                          certificate.email
                        )
                      }
                    >
                      Upload Certificate
                    </button>
                  </div>
                </dl>
              </div>
            </details>
          </React.Fragment>
        ))}
      </section>
    </div>
  );
};

export default UploadCertificate;
