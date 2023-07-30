import React from "react";
import teamPic from "../../Assets/images/about.svg";
import "./About.css";
const About = () => {
  return (
    <section className="about overflow-hidden py-4" id="about">
      <div className="row w-100">
        <div className="row col-md-11 mx-auto ">
          <div className="col-md-6 img">
            <img src={`${teamPic}`} alt="" className="img-fluid" />
          </div>
          <div className="col-md-6 ps-2">
            <p className="miniTitle">about us</p>
            <h1 className="headerTitle">
              We Empower you to Find the{" "}
              <span className="headerHighlight">right career</span> path
            </h1>
            <p className="headerContent">
              Join the Virtual Internship Program in emerging technologies with
              Right Path Predictor. We have started this internship prorgams for
              students to gain real industry level experience. In this
              internship program exprience employess also can enroll.
            </p>
            <h5>
              <i
                class="fa-sharp fa-solid fa-check-double"
                style={{ color: "#7355F7" }}
              ></i>{" "}
              Get Offer Letter{" "}
            </h5>
            <h5>
              {" "}
              <i
                class="fa-sharp fa-solid fa-check-double"
                style={{ color: "#7355F7" }}
              ></i>
              {" "} Internship Completion Certificate
            </h5>
            <h5>
              <i
                class="fa-sharp fa-solid fa-check-double"
                style={{ color: "#7355F7" }}
              ></i>
              {" "} Letter of Recommendation{" "}
            </h5>
            <h5>
              <i
                class="fa-sharp fa-solid fa-check-double"
                style={{ color: "#7355F7" }}
              ></i>
             {" "}  Earn Swags and Rewards
            </h5>
            {/* <button className="branBtn">learn More</button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
