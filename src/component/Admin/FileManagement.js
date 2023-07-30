import React, { useEffect, useState } from "react";
import app_config from "../../config";
const FileList = () => {
  const url = app_config.backend_url;
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFiles, setSearchedFiles] = useState([]);

  useEffect(() => {
    fetch(url+"/util/files")
      .then((response) => response.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const filteredFiles = files.filter((file) =>
      file.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchedFiles(filteredFiles);
  }, [files, searchQuery]);
  const deleteFile = (fileName) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the file?"
    );
    if (confirmDelete) {
      fetch(url+`/util/deletefile/${fileName}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          setFiles(files.filter((file) => file !== fileName));
        })
        .catch((error) => console.error(error));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  if (files.length === 0) {
    return (
      <div className="col-md text-center mt-5">
        <h3 className="headerTitle">No Files Found.</h3>
      </div>
    );
  }
  return (
    <div className="container">
      <h2 className="mb-4">Uploaded Files</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by file name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {searchedFiles.length === 0 && (
        <div className="text-center">No result found.</div>
      )}
      {searchedFiles.length > 0 && (
        <ul className="list-group">
          {searchedFiles.map((file, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <a
                href={url+`/util/files/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                {file}
              </a>
              <button
                onClick={() => deleteFile(file)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
