import React from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <main className="container py-5 text-center">
      <h1 className="h2">Requested page not found.</h1>
      <Link className="btn btn-primary mt-3" to="/">
        Go to Home
      </Link>
    </main>
  );
};

export default NotFound;
