import React from "react";
import "./Toaster.css";

const Toaster = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="toast-message" role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toaster;
