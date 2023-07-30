import { IconButton, InputBase, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import app_config from "../../config";
const AppliedList = () => {
  const url = app_config.backend_url;
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getDataFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+"/apply/getall");
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
  const deleteDomain = (userId, domainToDelete) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure Want to delete the "${domainToDelete}" domain?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            url+`/apply/delete/domain/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ domainToDelete }),
            }
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Domain deleted successfully",
            });
            getDataFromBackend();
          } else {
            throw new Error("Failed to delete domain");
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete domain",
          });
        }
      }
    });
  };

  useEffect(() => {
    getDataFromBackend();
  }, []);

  const displayUsers = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else {
      const filteredArray = userArray.filter(({ domain, appliedBy }) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          (domain &&
            domain.some((item) =>
              item?.toLowerCase().includes(lowerCaseQuery)
            )) ||
          (appliedBy && appliedBy.toLowerCase().includes(lowerCaseQuery))
        );
      });

      if (filteredArray.length === 0) {
        return (
          <div className="col-md text-center mt-5">
            <h3 className="headerTitle">No Result Found.</h3>
          </div>
        );
      } else {
        return filteredArray.map(({ _id, domain, appliedBy }) => (
          <tr key={_id}>
            {domain && domain.length > 0 ? (
              <>
                <td>
                  <ul>
                    {domain.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td>{appliedBy}</td>
                <td>
                  {domain && domain.length > 0 ? (
                    <div>
                      {domain.map((item, index) => (
                        <button
                          key={index}
                          className="btn btn-danger ms-2"
                          onClick={() => deleteDomain(_id, item)}
                        >
                          Delete
                        </button>
                      ))}
                    </div>
                  ) : null}
                </td>
              </>
            ) : null}
          </tr>
        ));
      }
    }
  };

  return (
    <>
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
              inputProps={{ "aria-label": "Enter Username to Search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div className="container mt-4" style={{ height: "100vh" }}>
        <h1 className="text-center mb-4">Applied Details</h1>
        <div className="row justify-content-center">
          <div className="col-md">
            <div className="table-responsive">
              {userArray.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-dark">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayUsers()}</tbody>
                  </table>
                </div>
              )}
              {userArray.length === 0 && (
                <div className="col-md text-center mt-5">
                  <h3 className="headerTitle">No Result Found.</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppliedList;
