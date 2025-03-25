import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../Styles/UserProfile.css";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

import { UserContext } from "../../Context/UserContext";
import axios from "axios";

const UserProfile = ({ showModal, handleClose }) => {
  const [userProfile, setUserProfile] = useState({
    username: "",
    purpose: "",
    profileImage: null, // This will hold the image URL
  });

  const [profileImage, setProfileImage] = useState(null); // Raw file for upload
  const [previewImage, setPreviewImage] = useState(null); // Base64 string for preview
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  // console.log("Userid is :",userId);
  

  // Fetch trainer profile on initial load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // console.log("before the api call");
        
        const response = await axios.get(
          `http://localhost:3000/user/${userId}/profile`
        );

        // console.log(response);
        // console.log(response.data);
        // console.log("Profile Image URL:", response.data.profileImage);

        
        const { username, purpose, profileImage } = response.data;
        setUserProfile({ username, purpose, profileImage });
      } catch (error) {
        console.error("Error fetching trainer profile:", error.response?.data || error.message);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // console.log("userProfile:",userProfile);
  

  // Handle image change for preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file); // Store the raw file for upload
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result); // Set preview image as base64
      reader.readAsDataURL(file);
    }
  };

  // Save image to the server
  const handleSaveImage = async () => {
    try {
      if (!profileImage) {
        alert("Please upload an image first");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      // Send FormData to the server
      const response = await axios.put(
        `http://localhost:3000/user/${userId}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message); // Show success message
      setUserProfile((prev) => ({
        ...prev,
        profileImage: response.data.profileImage, // Update with the new image URL
      }));
      setPreviewImage(null); // Clear the preview
    } catch (error) {
      console.error("Error updating profile image:", error.response?.data || error.message);
      alert("Failed to update profile image");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="right-side-modal-user"
      backdrop="static"
      dialogClassName="right-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="user-profile">
          {/* Profile Picture Section */}
          <div className="profile-picture-container">
            <div className="profile-picture">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="profile-image" />
              ) : userProfile.profileImage ? (
                <img
                  src={`http://localhost:3000${userProfile.profileImage}`}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="">Upload</div>
              )}
            </div>

            {/* Styled File Upload Button */}
            <div className="file-upload-container">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden-file-input"
              />
              <label htmlFor="file-upload" className="file-upload-btn">
                <Upload className="upload-icon" />
                Choose File
              </label>
            </div>
          </div>
            

          {/* User Details */}
          <h5>{userProfile.username}</h5>
          <p>Goal: {userProfile.purpose}</p>

          <Button variant="success" onClick={handleSaveImage}>
            Save Image
          </Button>
          <Button onClick={handleLogout} className="logout-user-profile">
            Logout
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfile;
