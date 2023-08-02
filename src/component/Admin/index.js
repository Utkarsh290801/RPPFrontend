import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AccountCircle } from "@mui/icons-material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PaidIcon from '@mui/icons-material/Paid';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ContactMailIcon from '@mui/icons-material/ContactMail';
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
      icon:<AcUnitIcon/>,
      link: "/admin/viewdomain",
    },
    {
      name: "User Manager",
      icon: <PersonIcon/>,
      link: "/admin/manageuser",
    },
    {
      name: "Applied List",
      icon: <VerifiedUserIcon />,
      link: "/admin/appliedlist",
    },
    {
      name: "Upload Offer Letter",
      icon: <UploadFileIcon />,
      link: "/admin/upload",
    },
    {
      name: "Offer Letter Detail",
      icon: <QueryStatsIcon />,
      link: "/admin/offerletterdetail",
    },
    {
      name: "Task Creation",
      icon: <AddTaskIcon />,
      link: "/admin/taskcreation",
    },
    {
      name: "Task Detail",
      icon: <InfoIcon />,
      link: "/admin/taskdetail",
    },
    {
      name: "Training Video",
      icon: <VideoSettingsIcon />,
      link: "/admin/training",
    },
    {
      name: "Video Detail",
      icon: <VideoLibraryIcon/>,
      link: "/admin/trainingdetail",
    },
    {
      name: "Submission Details",
      icon: <TaskAltIcon  />,
      link: "/admin/submissiondetail",
    },
    {
      name: "Payment Details",
      icon: <PaidIcon />,
      link: "/admin/paymentdetail",
    },
    {
      name: "Upload Certificate",
      icon: <DriveFolderUploadIcon  />,
      link: "/admin/uploadcertificate",
    },
    {
      name: "Certificate Detail",
      icon: <CardGiftcardIcon/>,
      link: "/admin/certificatedetail",
    },
    {
      name: "Contact Detail",
      icon: <ContactMailIcon/>,
      link: "/admin/contactdetail",
    },
    {
      name: "File Management",
      icon: <DashboardIcon />,
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
