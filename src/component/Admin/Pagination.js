import React, { useEffect, useState } from "react";

const Pagination = ({ showPerPage, onPaginationChange, total }) => {
  const [counter, setCounter] = useState(1);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    setNumPages(Math.ceil(total / showPerPage));
  }, [total, showPerPage]);

  const onButtonClick = (type) => {
    if (type === "prev") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "next") {
      if (counter === numPages) {
        setCounter(counter);
      } else {
        setCounter(counter + 1);
      }
    }
  };

  useEffect(() => {
    const value = showPerPage * counter;
    const start = value - showPerPage;
    const end = Math.min(value, total);
    onPaginationChange(start, end);
  }, [counter, showPerPage, total, onPaginationChange]);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div>
          <button
            className="btn btn-primary"
            onClick={() => onButtonClick("prev")}
            disabled={counter === 1}
          >
            Previous
          </button>
        </div>
        <div>
          Page {counter} of {numPages}
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => onButtonClick("next")}
            disabled={counter === numPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
