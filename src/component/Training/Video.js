import React, { useEffect, useState } from "react";
import "./Video.css";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import app_config from "../../config";

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const url = app_config.backend_url;
  const [offerData, setOfferData] = useState([]);
  const [filteredVideoData, setFilteredVideoData] = useState([]);

  const fetchVideoData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/video/getall");
      if (response.status === 200) {
        const data = await response.json();
        setVideoData(data);
        filterVideoData(data); // Call the filter function after setting video data
        console.log(data);
      } else {
        throw new Error("Failed to fetch video data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch video data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchOfferData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/offer/getall");
      if (response.status === 200) {
        const data = await response.json();
        setOfferData(data);
        console.log(data);
      } else {
        throw new Error("Failed to fetch offer data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch offer data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferData();
  }, []);

  const filterVideoData = (videoData) => {
    if (currentUser && offerData.length > 0) {
      const userOffers = offerData.filter(
        (offer) => offer.appliedBy === currentUser.email
      );
      const domainList = userOffers.map((offer) => offer.domain);
      const filteredData = videoData.filter((video) =>
        domainList.includes(video.domain)
      );
      setFilteredVideoData(filteredData);
    }
  };

  const openPopup = (video) => {
    setSelectedVideo(video);
  };

  const closePopup = () => {
    setSelectedVideo(null);
  };

  const getEmbedUrl = (videoUrl) => {
    if (videoUrl && videoUrl.includes("youtube.com")) {
      const videoId = videoUrl.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl && videoUrl.includes("drive.google.com")) {
      const fileId = videoUrl.split("/d/")[1].split("/view")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // Add logic for other video sources here
    return "";
  };

  useEffect(() => {
    filterVideoData(videoData);
  }, [videoData, currentUser, offerData]);

  return (
    <Container fluid>
      <h2 className="text-center my-4">References Video</h2>

      {loading ? (
        <p>Loading...</p>
      ) : filteredVideoData.length === 0 ? (
        <div className="col-md text-center mt-5">
          <h3 className="headerTitle">
            No Result
            <span className="headerHighlight"> Found </span>
          </h3>
        </div>
      ) : (
        <Row className="video-gallery">
          {filteredVideoData.map((video) => (
            <Col key={video.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <div className="video-item" onClick={() => openPopup(video)}>
                <div className="thumbnail-overlay">
                  <img
                    className="video-thumbnail"
                    src={`https://img.youtube.com/vi/${video.link}/mqdefault.jpg`}
                    alt={video.title}
                  />
                  <div className="play-button"></div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  <span className="domain-tag custom-download-list-ext badge bg-primary">
                    {video.domain}
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {selectedVideo && (
        <Modal show={true} onHide={closePopup} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedVideo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="video-player-wrapper">
              <iframe
                className="video-player"
                src={getEmbedUrl(selectedVideo.link)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default VideoGallery;
