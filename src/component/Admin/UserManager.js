import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ShowUserDetail from "./ShowUserDetail";
import { MDBCardImage } from "mdb-react-ui-kit";
import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "./Pagination";
import "./UserManager.css";
import app_config from "../../config";
const UserManager = () => {
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [InternshipDataArray, setInternshipDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPerPage, setShowPerPage] = useState(5);
  const [pagination, setPagination] = useState({ start: 0, end: showPerPage });
  const [selUser, setSelUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showUserDetailText, setShowUserDetailText] = useState(true);
  const updateUser = (user) => {
    console.log(user.curr);
    setSelUser(user.curr);
    setShowUpdateForm(true);
    setShowUserDetailText(false);
  };

  const onPaginationChange = (start, end) => {
    // console.log(start, end);
    setPagination({ start: start, end: end });
  };

  const getDataFromBackend = async () => {
    setLoading(true);

    const fetchData = async () => {
      const response = await fetch(url + "/user/getall");
      const data = await response.json();
      console.log(data);
      setUserArray(data);
      setSearchResults(data);
      setLoading(false);
    };

    // Fetch data initially
    await fetchData();

    // Fetch data every 5 seconds
    // setInterval(fetchData, 5000);
  };
  const changeStatusOfUser = async (id, isAdmin , isBlocked) => {
    try {
      const response = await fetch(url + "/user/update/" + id, {
        method: "PUT",
        body: JSON.stringify({ isAdmin, isBlocked }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User status updated successfully",
        });
        // Update the isAdmin value in the selected user object
        setSelUser((prevUser) => ({ ...prevUser, isAdmin, isBlocked }));
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user status",
      });
    }
  };
  const getInternshipDatafromBackend = async () => {
    const response = await fetch(url + "/apply/getall");
    const data = await response.json();
    console.log(data);
    setInternshipDataArray(data);
  };
  useEffect(() => {
    getInternshipDatafromBackend();
  }, []);
  const deleteUser = async (id) => {
    console.log(id);
    const response = await fetch(url+"/user/delete/" + id, {
      method: "DELETE",
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User deleted successfully",
      });

      // Remove the deleted user from userArray
      setUserArray((prevUserArray) =>
        prevUserArray.filter((user) => user._id !== id)
      );

      // Remove the deleted user from searchResults
      setSearchResults((prevSearchResults) =>
        prevSearchResults.filter((user) => user._id !== id)
      );

      // If the deleted user is the currently selected user, reset the selection
      if (selUser && selUser._id === id) {
        setSelUser(null);
        setShowUpdateForm(false);
      }
    }
  };

  const handleFilter = async () => {
    const response = await fetch(url + "/user/getall");
    const data = await response.json();

    const filteredResults = data.filter((value) => {
      return value.username.toLowerCase().includes(filter.toLowerCase());
    });

    setSearchResults(filteredResults);
  };

  useEffect(() => {
    getDataFromBackend();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md">
          <Paper
            component="form"
            className="float-end mb-2"
            sx={{
              p: "2px 4px",
              display: "flex",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Enter Username to Search"
              onChange={(e) => setFilter(e.target.value)}
              inputProps={{ "aria-label": "Enter Username to Search" }}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={handleFilter}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div className="card mb-3">
        <div className="row">
          <div className="col-md-5">
            <div className="m-3">
              <h1>Users List</h1>
              <Pagination
                showPerPage={showPerPage}
                onPaginationChange={onPaginationChange}
                total={searchResults.length}
              />
            </div>
            <div className="table-responsive p-2">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>UserEmail</th>
                    <th>UserDetails</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults
                    .slice(pagination.start, pagination.end)
                    .map((curr) => {
                      const isAdmin = curr.isAdmin;
                      const isBlocked = curr.isBlocked;
                      const rowClass = isAdmin ? "admin-row" : isBlocked ? "blocked-row" : "";
                      if (loading) {
                        return (
                          <tr key={curr._id}>
                            <td colSpan="3" className="text-center">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={curr._id} className={rowClass}>
                            <td>
                              <div className="d-flex align-items-center">
                                <MDBCardImage
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                  className="rounded-circle img-fluid mt-2"
                                  style={{ height: "50px", width: "60px" }}
                                />
                              </div>
                            </td>
                            <td>{curr.email}</td>
                            <td>
                              <button
                                className="btn btn-primary mt-3"
                                onClick={() => updateUser({ curr })}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
              {searchResults.length === 0 && (
                <div className="text-center mt-3">
                  <p>No results found.</p>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-7">
            <div className="card-body">
              {showUpdateForm && (
                <div className="col-md">
                  <ShowUserDetail
                    selUser={selUser}
                    setSelUser={setSelUser}
                    setShowUpdateForm={setShowUpdateForm}
                    deleteUser={deleteUser}
                    setShowUserDetailText={setShowUserDetailText}
                    changeStatusOfUser={changeStatusOfUser}
                    internshipData={InternshipDataArray}
                  />
                </div>
              )}
              {showUserDetailText && ( // Display the initial message
                <div className="col-md text-center mt-5">
                  <h3 className="headerTitle">
                    Click on the{" "}
                    <span className="headerHighlight">"View Details"</span>{" "}
                    button to get the user details.
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
