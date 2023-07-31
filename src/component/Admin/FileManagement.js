import React, { useEffect, useState } from "react";
import app_config from "../../config";

const FileList = () => {
  const url = app_config.backend_url;
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch(url + "/util/files")
      .then((response) => response.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      })
      .catch((error) => console.error(error));
  }, [url]);

  useEffect(() => {
    const filteredFiles = files.filter((file) =>
      file.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchedFiles(filteredFiles);
  }, [files, searchQuery]);

  const deleteFiles = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected files?"
    );
    if (confirmDelete) {
      Promise.all(
        selectedFiles.map((fileName) =>
          fetch(url + `/util/deletefile/${fileName}`, {
            method: "DELETE",
          })
        )
      )
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((data) => {
          console.log(data); // Optionally, you can log the response data
          setFiles(files.filter((file) => !selectedFiles.includes(file)));
          setSelectedFiles([]);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFileCheckboxChange = (e) => {
    const fileName = e.target.value;
    if (e.target.checked) {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, fileName]);
    } else {
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((file) => file !== fileName)
      );
    }
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedFiles(e.target.checked ? searchedFiles : []);
  };

  if (files.length === 0) {
    return (
      <div className="col-md text-center mt-5">
        <h3 className="headerTitle">No Files Found.</h3>
      </div>
    );
  }
  return (
    <div className="container" style={containerStyle}>
      <div style={deleteButtonContainer}>
        {selectedFiles.length > 0 && (
          <button
            onClick={deleteFiles}
            className="btn btn-danger"
            style={deleteButtonStyle}
          >
            Delete Selected Files
          </button>
        )}
      </div>
      <h2 style={headerStyle}>Uploaded Files</h2>
      <div style={checkboxContainer}>
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectAll}
            onChange={handleSelectAll}
            style={selectAllCheckboxStyle}
          />
          <span className="ml-2">Select All</span>
        </label>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by file name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={inputStyle}
        />
      </div>
      {searchedFiles.length === 0 && (
        <div className="text-center" style={noResultStyle}>
          No result found.
        </div>
      )}
      {searchedFiles.length > 0 && (
        <div>
          <ul className="list-group">
            {searchedFiles.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={listItemStyle}
              >
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={file}
                    onChange={handleFileCheckboxChange}
                    checked={selectedFiles.includes(file)}
                    style={checkboxStyle}
                  />
                  <span className="ml-2 file-name" style={fileNameStyle}>
                    <a
                      href={url + `/util/files/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {file}
                    </a>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileList;

//

// Inline styles
const containerStyle = {
  padding: "20px",
  backgroundColor: "#f4f4f4",
  borderRadius: "10px",
};

const headerStyle = {
  marginBottom: "1.5rem",
};

const inputStyle = {
  borderRadius: "10px",
};

const noResultStyle = {
  textAlign: "center",
};

const listItemStyle = {
  border: "none",
  backgroundColor: "#fff",
  borderRadius: "10px",
  marginBottom: "10px",
  padding: "15px",
};

const checkboxStyle = {
  marginRight: "10px",
};

const fileNameStyle = {
  flex: "1",
};

const deleteButtonContainer = {
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
};

const deleteButtonStyle = {
  marginTop: "10px",
};
const checkboxContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1rem",
};

const selectAllCheckboxStyle = {
  marginRight: "0.5rem",
};