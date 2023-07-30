import React from 'react';
import NotFoundImg from '../../Assets/images/404.svg';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={NotFoundImg} alt="" className="not-found-image" />
    </div>
  );
};

export default NotFound;
