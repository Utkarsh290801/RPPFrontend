import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginModal.css";
import log from "../../Assets/images/log.svg";
import desk from "../../Assets/images/register.svg";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Form = () => {
  const [isSignUp, setSignUp] = useState(false);

  const handleSignUpSuccess = () => {
    setSignUp(false); // Switch to the SignInForm after successful signup
  };

  return (
    <div className={`${isSignUp ? "fContainer sign-up-mode" : "fContainer"}`}>
      <Link to="/">
        <span className="pageCloseBtn">
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </Link>
      <div className="forms-container">
        <div className="signIn-singUp">
        {isSignUp ? (
            <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
          ) : (
            <SignInForm />
          )}
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
              beatae quas magnam!
            </p>
            <button
              className="iBtn transparent"
              onClick={() => setSignUp(true)}
            >
              Sign Up
            </button>
          </div>
          <img src={`${log}`} alt="" className="pImg" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
              beatae quas magnam!
            </p>
            <button
              className="iBtn transparent"
              onClick={() => setSignUp(false)}
            >
              Sign In
            </button>
          </div>
          <img src={`${desk}`} alt="" className="pImg" />
        </div>
      </div>
    </div>
  );
};

export default Form;
