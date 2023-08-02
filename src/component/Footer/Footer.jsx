import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import FooterCol from "./FooterCol";
import "./Footer.css";
import { usefulLink, ourServices, otherLinks, footerInfo } from "./FooterData";
import FooterInfo from "./FooterInfo";
import { Link } from "react-router-dom";
import upstart from "../../Assets/images/upstart.png";
import msme from "../../Assets/images/msme.png";
import ind from "../../Assets/images/ind.png";
const Footer = () => {
  return (
    <section className="row footer">
      <Row className="col-md-11 mx-auto">
        <Row className="align-items-center footerInfo">
          {footerInfo.map((data) => (
            <FooterInfo data={data} key={data.id} />
          ))}
        </Row>
        <Col md={6} lg={3} className="fAboutUs">
          <h5>ABOUT US</h5>
          <span className="animate-border"></span>
          <p className="aboutUsDes">
            Right Path Predictor is working in field of Software Designing,
            development, customization, implementation, & others. Also, our
            company is serving for various social sector problems.
            {/* <div className="social-media-custom" data-testid="images">
              <img src={upstart} alt="upstart" className="upstart" />
              <img src={msme} alt="msme" />
              <img src={ind} alt="ind" />
            </div> */}
          </p>
          {/* <ul className="socialIcons">
            <li>
              <Link to="https://www.facebook.com/profile.php?id=100088203945476" >
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
            </li>
            <li>
              <Link to="https://twitter.com/R_P_PREDICTORS">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li>
              <Link to="https://www.instagram.com/rightpathpredictor">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </li>
            <li>
              <Link to="https://www.linkedin.com/company/right-path-predictor-pvt-ltd">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </li>
          </ul> */}
          <ul className="socialIcons">
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=100088203945476"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/R_P_PREDICTORS"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/rightpathpredictor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/right-path-predictor-pvt-ltd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </li>
          </ul>
        </Col>
        <FooterCol key="2" menuItems={usefulLink} title="USEFUL LINK" />
        <FooterCol key="3" menuItems={ourServices} title="OUR SERVICES" />
        <FooterCol key="4" menuItems={otherLinks} title="OTHER LINKS" />
      </Row>
      <p className="copyRight">
        Copyright &copy; 2023{" "}
        <span className="fHighlight">
          <a
            href="https://rightpathpredictor.in/"
            target="_blank"
            rel="noopener noreferrer"
           style={{color:"white"}}
          >
            RIGHT PATH PREDICTOR PVT.LTD
          </a>
        </span>
        . All rights reserved.
      </p>
    </section>
  );
};

export default Footer;
