import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/TrainerHeader.css";

const TrainerHeader = () => {
  return (
    <header className="trainer-headers">
      <div className="trainer-header-right">
        
          <Link to="/trainer/dashboard" className="trainer-nav-link">Dashboard </Link>
      </div>
    </header>
  );
};

export default TrainerHeader;
