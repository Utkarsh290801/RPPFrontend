import React, { useEffect, useState } from "react";
import "./PaymentDetails.css"; // Import the CSS file containing custom styles
import Swal from "sweetalert2";
import app_config from "../../config";
const PaymentDetails = () => {
  const url = app_config.backend_url;
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/payment/getall");
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
  const deleteUser = async (id) => {
    console.log(id);
    try {
      const response = await fetch(
        url+`/payment/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment deleted successfully",
        });
        fetchPaymentData();
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
    fetchPaymentData();
  }, []);

  if (loading) {
    return  <div className="col-md text-center mt-5">
    <h3 className="headerTitle">Loading......</h3>
  </div>;
  }
  if (paymentData.length === 0) {
    return  <div className="col-md text-center mt-5">
    <h3 className="headerTitle">No Result Found.</h3>
  </div>;
  }
  return (
    <section className="latest-transactions">
      <h1>Transactions Detail</h1>
<h2></h2>
      {paymentData.map((payment, index) => (
        <details key={index}>
          <summary>
            <div className="transaction-item">
              <span
                className="transaction-icon"
                style={{ backgroundColor: "#f2dcbb" }}
              >
             <i class="fa-sharp fa-solid fa-indian-rupee-sign"> </i>
              </span>
              <h3>
                <strong>{payment.name}</strong>
                <small>{payment.email}</small>
              </h3>
              <span>
                <a
                  href={url+`/util/files/${payment.screenshot}`}
                  target="_blank"
                  download
                  rel="noopener noreferrer"
                >
                  Payment Slip
                </a>
              </span>
            </div>
          </summary>
          <div>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{payment.createdate}</dd>
              </div>
              <div>
                <dt>Domain</dt>
                <dd>{payment.domain}</dd>
              </div>
              <div>
                <dt>Payment ID</dt>
                <dd>{payment._id}</dd>
              </div>
              <span>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => deleteUser(payment._id)} // Pass payment._id as the parameter
                >
                  <i className="fas fa-trash"></i>
                </button>
              </span>
            </dl>
          </div>
        </details>
      ))}
    </section>
  );
};

export default PaymentDetails;
