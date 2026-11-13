import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="site-footer text-white">
    <Link to="/" className="site-footer-brand">
      SHOP
    </Link>
    <p>Find your next favorite from our growing catalog.</p>
    <Link to="/products">Browse products</Link>
  </footer>
);

export default Footer;
