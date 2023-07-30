import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./FileUploader.css";
import app_config from "../../config";
const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [uploading, setUploading] = useState(false);
  const url = app_config.backend_url;
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + "/service/getall");
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUserArray(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataFromBackend();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedOption) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("myfile", selectedFile);

    fetch(url + "/util/uploadfile", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("File uploaded");
          return response.json();
        } else {
          throw new Error("File upload failed");
        }
      })
      .then((data) => {
        const fileName = data.fileName; // Assuming the response contains the file name

        const taskData = {
          domain: selectedOption,
          file: fileName,
        };

        return fetch(url + "/task/add", {
          method: "POST",
          body: JSON.stringify(taskData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Task added successfully");
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Task added successfully!",
          });
          // Reset the component state
          setSelectedFile(null);
          setPreviewUrl("");
          setSelectedOption("");
        } else {
          throw new Error("Task addition failed");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add task",
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="file-uploader-container">
      <h2 className="task-heading"> Task Creation</h2>
      <div className={`custom-file-uploader ${isDragging ? "dragging" : ""}`}>
        <label
          htmlFor="file-input"
          className="custom-file-drop-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="custom-file-drop-text">
            {selectedFile ? (
              <>
                {selectedFile.type.includes("image") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="custom-file-preview-image"
                  />
                ) : (
                  <object
                    data={previewUrl}
                    type="application/pdf"
                    className="custom-file-preview-pdf"
                  >
                    <p>PDF preview is not supported by your browser.</p>
                  </object>
                )}
                <button className="clear-button" onClick={handleClearFile}>
                  Clear
                </button>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop files here or click to select files</p>
              </>
            )}
          </div>
          <input
            type="file"
            id="file-input"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="custom-file-input"
          />
        </label>
      </div>
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        className="custom-select"
      >
        <option value="">Select a domain</option>
        {userArray.map((user, index) => (
          <option key={index} value={user.domain}>
            {user.domain}
          </option>
        ))}
      </select>

      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile || !selectedOption || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUploader;
