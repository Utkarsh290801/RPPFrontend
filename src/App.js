import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginModal from "./component/Login/LoginModal";
import Banner from "./component/Home/Banner";
import { AppProvider } from "./context/AppContext";
import { useState } from "react";
import ServiceForm from "./component/Admin/ServiceForm";
import Services from "./component/User/Services/Services";
import AdminAuthorisor from "./context/AdminAuth";
import UserAuthorisor from "./context/UserAuth";
import Main from "./component/Dashboard/Dashboard";
import NotFound from "./component/NotFound/NotFound";
import ResetPassword from "./component/Login/ResetPassword";
import InternshipApply from "./component/User/Services/InternshipApply";
import User from "./component/User";
import Contact from "./component/User/Contact/Contact";
import About from "./component/About/About";
import Admin from "./component/Admin";
import UserManager from "./component/Admin/UserManager";
import Profile from "./component/Admin/Profile";
import ViewDomainList from "./component/Admin/ViewDomainList";
import ContactDetail from "./component/Admin/ContactDetail";
import SubmissionDetail from "./component/Admin/SubmissionDetail";
import AppliedList from "./component/Admin/AppliedList";
import PaymentDetails from "./component/Admin/PaymentDetails";
import UploadLetter from "./component/Admin/UploadLetter";
import OfferLetterDetail from "./component/Admin/OfferLetterDetail";
import UploadCertificate from "./component/Admin/UploadCertificate";
import FileManagement from "./component/Admin/FileManagement";
import CertificationDetail from "./component/Admin/CertificationDetail";
import TaskCreation from "./component/Admin/TaskCreation";
import TaskDetail from "./component/Admin/TaskDetail";
import Training from "./component/Admin/Training";
import VideoDetail from "./component/Admin/VideoDetail";
import BuildTools from "./component/BuildTools/BuildTools";

function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  return (
    <div>
      <AppProvider currentUser={currentUser}>
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Banner />} />
            <Route path="/login" element={<LoginModal />} />

            <Route
              element={
                <AdminAuthorisor>
                  <Admin />
                </AdminAuthorisor>
              }
              path="admin"
            >
              <Route element={<VideoDetail />} path="trainingdetail" />
              <Route element={<Training />} path="training" />
              <Route element={<TaskDetail />} path="taskdetail" />
              <Route element={<TaskCreation />} path="taskcreation" />
              <Route element={<FileManagement />} path="filemanagement" />
              <Route
                element={<CertificationDetail />}
                path="certificatedetail"
              />
              <Route element={<OfferLetterDetail />} path="offerletterdetail" />
              <Route element={<UploadLetter />} path="upload" />
              <Route element={<PaymentDetails />} path="paymentdetail" />
              <Route element={<AppliedList />} path="appliedlist" />
              <Route element={<SubmissionDetail />} path="submissiondetail" />
              <Route element={<ContactDetail />} path="contactdetail" />
              <Route element={<ViewDomainList />} path="viewdomain" />
              <Route element={<Profile />} path="profile" />
              <Route element={<UserManager />} path="manageuser" />
              <Route element={<UploadCertificate />} path="uploadcertificate" />
              <Route element={<ServiceForm />} path="addservice" />
            </Route>
            <Route path="reset" element={<ResetPassword />} />
            <Route element={<NotFound></NotFound>} path="notfound" />
            <Route
              path="/dashboard/*"
              element={
                <UserAuthorisor>
                  <Main />
                </UserAuthorisor>
              }
            />
            <Route path="user" element={<User />}>
              <Route path="service" element={<Services />} />
              <Route path="faq" element={<BuildTools />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route
                path="apply/:id"
                element={
                  <UserAuthorisor>
                    <InternshipApply />
                  </UserAuthorisor>
                }
              />
            </Route>

            <Route element={<Navigate to="/notfound" />} path="*" />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
