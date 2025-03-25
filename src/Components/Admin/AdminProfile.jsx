import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
// import "../../Styles/UserProfile.css";
import "../../Styles/AdminProfile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { Upload } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

const AdminProfile = ({ showModal, handleClose }) => {
  const [adminProfile, setAdminProfile] = useState({
    username: "",
    profileImage: null, // This will hold the image URL
  });

  const [profileImage, setProfileImage] = useState(null); // Raw file for upload
  const [previewImage, setPreviewImage] = useState(null); // Base64 string for preview
  const navigate = useNavigate();
  const adminId = sessionStorage.getItem("adminId");

  // Fetch trainer profile on initial load
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        console.log("before the api call");

        const response = await axios.get(
          `http://localhost:3000/admin/${adminId}/profile`
        );

        console.log(response.data);
        console.log("Profile Image URL:", response.data.profileImage);

        const { username, profileImage } = response.data;
        setAdminProfile({ username, profileImage });
      } catch (error) {
        console.error(
          "Error fetching admin profile:",
          error.response?.data || error.message
        );
      }
    };

    if (adminId) {
      fetchAdminProfile();
    }
  }, [adminId]);

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
        // alert("Please upload an image first");
        toast.error("Please upload an image first");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      // Send FormData to the server
      const response = await axios.put(
        `http://localhost:3000/admin/${adminId}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // alert(response.data.message); 
      toast.success(response.data.message)
      setAdminProfile((prev) => ({
        ...prev,
        profileImage: response.data.profileImage, // Update with the new image URL
      }));
      setPreviewImage(null); // Clear the preview
    } catch (error) {
      console.error(
        "Error updating profile image:",
        error.response?.data || error.message
      );
      // alert("Failed to update profile image");
      toast.error("Failed to update profile image")
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logout successful")

    setTimeout(() => {     
      navigate("/login");
    }, 1000);
  };
  

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        className="right-side-modal-admin"
        backdrop="static"
        dialogClassName="right-modal-dialog-admin"
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="admin-profile">
            {/* Profile Picture Section */}
            <div className="profile-picture-container-admin">
              <div className="profile-picture-admin">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="profile-image-admin"
                  />
                ) : adminProfile.profileImage ? (
                  <img
                    src={`http://localhost:3000${adminProfile.profileImage}`}
                    alt="Profile"
                    className="profile-image-admin"
                  />
                ) : (
                  <div className="">Upload</div>
                )}
              </div>

              {/* Styled File Upload Button */}
              <div className="file-upload-container-admin">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />
                <label htmlFor="file-upload" className="file-upload-btn-admin">
                  <Upload className="upload-icon" />
                  Choose File
                </label>
              </div>
            </div>

            {/* User Details */}
            {console.log("admin profile:", adminProfile)}
            <h5>Admin : {adminProfile.username}</h5>

            <Button variant="success" onClick={handleSaveImage}>
              Save Image
            </Button>
            <Button
              variant="danger"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF5252",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default AdminProfile;
