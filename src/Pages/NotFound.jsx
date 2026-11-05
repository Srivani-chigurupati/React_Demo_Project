import React from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div>
      <h2>Requested page not Found.</h2>
      <Link to="/">
        <p>Go to Home.</p>
      </Link>
    </div>
  );
};

export default NotFound;
