import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound">
      <div className="notfound-sub">
        <h2>Sorry, this page isn't available.</h2>
        <span>
          The link you followed may be broken, or the page may have been
          removed.{" "}
          <Link to="/" className="notfound-sub-span-link">
            <span className="notfound-sub-span-blue">
              Go back to Instagram.
            </span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default NotFound;
