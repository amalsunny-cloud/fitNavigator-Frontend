import React, { useState } from "react";
// import Header from "../Header";
import UserProfile from "./UserProfile";
import UserDashboard from "../../Pages/User/UserDashboard";


const ParentProfileModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () =>  console.log("Modal show triggered"); setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <UserDashboard handleShow={handleShow} />
      <UserProfile showModal={showModal} handleClose={handleClose} />
    </div>
  );
};

export default ParentProfileModal;
