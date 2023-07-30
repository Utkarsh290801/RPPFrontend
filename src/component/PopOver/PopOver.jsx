import React, { useContext } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Button, Overlay } from "react-bootstrap";
import Popover from "react-bootstrap/Popover";
import "./PopOver.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const PopOver = () => {
  const navigate = useNavigate();
  const { loggedIn, setloggedIn } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("admin");
    setloggedIn(false);
    navigate("/login");
  };

  const currentUserData = sessionStorage.getItem("user");
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

  return (
    <>
      <img
        src="https://img.freepik.com/free-icon/user_318-159711.jpg"
        alt=""
        className="popImg"
        onClick={handleClick}
      />
      <Overlay
        placement="bottom"
        containerPadding={10}
        show={show}
        target={target}
        container={ref.current}
      >
        <Popover id="popover-contained" className="">
          <div className="card">
            <div className="card-body">
              <div className="text-center ">
                <img
                  src="https://img.freepik.com/free-icon/user_318-159711.jpg"
                  alt=""
                  className="popUserImg"
                />
                <p className="userName">{currentUser?.username}</p>
                <p className="userEmail">{currentUser?.email}</p>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </Popover>
      </Overlay>
    </>
  );
};

export default PopOver;
