import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminAuthorisor = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  console.log(currentUser);

  if (currentUser === null) {
    Swal.fire({
      icon: "info",
      title: "OOops!!",
      text: "You need to be user",
    });
    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
};

export default AdminAuthorisor;
