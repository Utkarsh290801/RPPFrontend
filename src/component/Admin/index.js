import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AccountCircle } from "@mui/icons-material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const Admin = () => {
  const options = [
    {
      name: "Profile",
      icon: <AccountCircle />,
      link: "/admin/profile",
    },
    {
      name: "Create Internships",
      icon: <ManageAccountsIcon />,
      link: "/admin/addservice",
    },
    {
      name: "View Domain",
      icon: <ManageAccountsIcon />,
      link: "/admin/viewdomain",
    },
    {
      name: "User Manager",
      icon: <ManageAccountsIcon />,
      link: "/admin/manageuser",
    },
    {
      name: "Applied List",
      icon: <ManageAccountsIcon />,
      link: "/admin/appliedlist",
    },
    {
      name: "Upload Offer Letter",
      icon: <DashboardIcon />,
      link: "/admin/upload",
    },
    {
      name: "Offer Letter Detail",
      icon: <ManageAccountsIcon />,
      link: "/admin/offerletterdetail",
    },
    {
      name: "Task Creation",
      icon: <ManageAccountsIcon />,
      link: "/admin/taskcreation",
    },
    {
      name: "Task Detail",
      icon: <ManageAccountsIcon />,
      link: "/admin/taskdetail",
    },
    {
      name: "Training Video",
      icon: <DashboardIcon />,
      link: "/admin/training",
    },
    {
      name: "Video Detail",
      icon: <DashboardIcon />,
      link: "/admin/trainingdetail",
    },
    {
      name: "Submission Details",
      icon: <DashboardIcon />,
      link: "/admin/submissiondetail",
    },
    {
      name: "Payment Details",
      icon: <DashboardIcon />,
      link: "/admin/paymentdetail",
    },
    {
      name: "Upload Certificate",
      icon: <QueryStatsIcon />,
      link: "/admin/uploadcertificate",
    },
    {
      name: "Certificate Detail",
      icon: <QueryStatsIcon />,
      link: "/admin/certificatedetail",
    },
    {
      name: "Contact Detail",
      icon: <QueryStatsIcon />,
      link: "/admin/contactdetail",
    },
    {
      name: "File Management",
      icon: <QueryStatsIcon />,
      link: "/admin/filemanagement",
    },
  ];

  return (
    <div>
      <Sidebar title="Admin Dashboard /" options={options}>
        <Outlet />
      </Sidebar>
    </div>
  );
};

export default Admin;
