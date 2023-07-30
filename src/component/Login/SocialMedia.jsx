import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

const SocialMedia = () => {
  return (
    <div className="social-media">
      <div className="social-icon">
        <FontAwesomeIcon icon={faGoogle} />
      </div>
      <div className="social-icon">
        <FontAwesomeIcon icon={faFacebook} />
      </div>
      <div className="social-icon">
        <FontAwesomeIcon icon={faGithub} />
      </div>
    </div>
  );
};

export default SocialMedia;
