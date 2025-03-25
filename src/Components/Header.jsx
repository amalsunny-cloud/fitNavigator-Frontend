import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Header.css";

const Header = () => {
  return (
    <header className="user-headers">
      <div className="user-header-right">
          <Link to="/userdashboard" className="user-nav-link">Dashboard </Link>
      </div>
    </header>
  );
};

export default Header;
