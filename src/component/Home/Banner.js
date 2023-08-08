import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import Navbar from "./Navbar";
import BuildTools from "../BuildTools/BuildTools";
import Footer from "../Footer/Footer";
import Contact from "../User/Contact/Contact";
import About from "../About/About";
import Services from "../User/Services/Services";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import upstart from "../../Assets/images/upstart.png";
import msme from "../../Assets/images/msme.png";
import ind from "../../Assets/images/ind.png";
const Banner = () => {
  const [filter, setFilter] = useState("");
  return (
    <div>
      <Navbar setFilter={setFilter} />
      {/* {filter && <Services filter={filter} />} */}
      {filter ? <Services filter={filter} /> : null}

      {filter ? null : (
        <div>
          <div className="banner-img">
            <div className="banner-title">
              <h3>
                Find <span className="banner-span">Internships</span> in Your
                <br />
                <span className="banner-span"> Favorite Domain!</span>
              </h3>
              <div className="small-tagline">
                <p>
                  Experience the real world. Intern with us and gain invaluable
                  skills.
                </p>
              </div>
            </div>
            <div className="banner-button" data-testid="btn">
              <a href="#services">Browse Interenships</a>
            </div>
          </div>
          <div className="text-center">
          <h4 className="sectionTitle miniTitle text-center">Our Recognition</h4>
         
          </div>
          <div className="social-media" data-testid="images">
            <img src={upstart} alt="upstart" className="upstart" />
            <img src={msme} alt="msme" />
            <img src={ind} alt="ind" />
          </div>
          <About />
          <Services />
          <Contact />
          <BuildTools />
          {/* <div className="social-media" data-testid="images">
            <img src={upstart} alt="upstart" className="upstart" />
            <img src={msme} alt="msme" />
            <img src={ind} alt="ind" />
          </div>
          <br></br> */}
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </div>
  );
};

export default Banner;
