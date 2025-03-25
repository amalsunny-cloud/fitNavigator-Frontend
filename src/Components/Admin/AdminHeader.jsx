import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/AdminHeader.css";

const AdminHeader = () => {
  return (
    
    <header className="admin-hheader">
          <div className="admin-hheader-container">
            
              <Link to="/admindashboard" className="admin-dashboard-link">Dashboard </Link>
          </div>
        </header>
  );
};

export default AdminHeader;
