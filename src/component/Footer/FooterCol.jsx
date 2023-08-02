import React from "react";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

const FooterCol = (props) => {
  return (
    <Col md={6} lg={3} className="footerLink">
      <h5>{props.title ? props.title : ""}</h5>
      {props.menuItems?.map(({ name, id, link }) => (
        // <Link to={link} key={id}>
        //   <li>
        //     <FontAwesomeIcon icon={faAngleDoubleRight}
        //         className="footArrowIcon"/>
        //     {name}
        //   </li>
        // </Link>
        <React.Fragment key={id}>
          {link ? (
            link.startsWith("http") ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                <li>
                  <FontAwesomeIcon
                    icon={faAngleDoubleRight}
                    className="footArrowIcon"
                  />
                  {name}
                </li>
              </a>
            ) : (
              <Link to={link} key={id}>
                <li>
                  <FontAwesomeIcon
                    icon={faAngleDoubleRight}
                    className="footArrowIcon"
                  />
                  {name}
                </li>
              </Link>
            )
          ) : (
            <li>
              <FontAwesomeIcon
                icon={faAngleDoubleRight}
                className="footArrowIcon"
              />
              {name}
            </li>
          )}
        </React.Fragment>
      ))}
      {props.children && props.children}
    </Col>
  );
};

export default FooterCol;
