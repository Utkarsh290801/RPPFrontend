import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import Profile from "../Profile/Profile";
import EditProfile from "../EditProfile/EditProfile";
import PaymentForm from "../Task/PaymentForm";
import Offerletter from "../OfferLetter/Offerletter";
import Certificate from "../Certificate/Certificate";
import TaskAllocation from "../TaskAllocation/TaskAllocation";
import Video from "../Training/Video";

const Main = () => {
  return (
    <UserDashboard>
      <Routes>
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/edit" element={<EditProfile />} />
        <Route path="/dashboard/submission" element={<Profile />} />
        <Route path="/dashboard/payment" element={<PaymentForm/>} />
        <Route path="/dashboard/offerletter" element={<Offerletter/>} />
        <Route path="/dashboard/certificate" element={<Certificate/>} />
        <Route path="/dashboard/taskallocated" element={<TaskAllocation/>} />
        <Route path="/dashboard/video" element={<Video/>} />
      </Routes>
      <Outlet />
    </UserDashboard>
  );
};

export default Main;
