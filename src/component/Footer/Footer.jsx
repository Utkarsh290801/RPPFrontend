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
            Right Path Predictor is working in field of Software Designing, development, customization, implementation, & others.
Also, our company is serving for various social sector problems.
            {/* <div className="social-media-custom" data-testid="images">
              <img src={upstart} alt="upstart" className="upstart" />
              <img src={msme} alt="msme" />
              <img src={ind} alt="ind" />
            </div> */}
          </p>
          <ul className="socialIcons">
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </li>
          </ul>
        </Col>
        <FooterCol key="2" menuItems={usefulLink} title="USEFUL LINK" />
        <FooterCol key="3" menuItems={ourServices} title="OUR SERVICES" />
        <FooterCol key="4" menuItems={otherLinks} title="OTHER LINKS" />
      </Row>
      <p className="copyRight">
        Copyright &copy; 2023 <span className="fHighlight">Utkarsh Arora</span>.
        All rights reserved.
      </p>
    </section>
  );
};

export default Footer;
