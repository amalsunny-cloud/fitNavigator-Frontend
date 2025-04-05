import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../Styles/TrainerProfile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { Upload } from "lucide-react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const TrainerProfile = ({ showModal, handleClose }) => {
  const [trainerProfile, setTrainerProfile] = useState({
    username: "",
    specialization: "",
    profileImage: null, // This will hold the image URL
  });

  const [profileImage, setProfileImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); 
  const navigate = useNavigate();
  const trainerId = sessionStorage.getItem("trainerId");

  // Fetch trainer profile on initial load
  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        console.log("before the api call");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/trainer/${trainerId}/profile`
        );

        console.log(response.data);
        console.log("Profile Image URL:", response.data.profileImage);

        const { username, specialization, profileImage } = response.data;
        setTrainerProfile({ username, specialization, profileImage });
      } catch (error) {
        console.error(
          "Error fetching trainer profile:",
          error.response?.data || error.message
        );
        toast.error("Error fetching trainer profile");
      }
    };

    if (trainerId) {
      fetchTrainerProfile();
    }
  }, [trainerId]);

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



  const handleSaveImage = async () => {
    try {
      if (!profileImage) {
        toast.error("Please upload an image first");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      // Send FormData to the server
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/trainer/${trainerId}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );


      toast.success(response.data.message);
      setTrainerProfile((prev) => ({
        ...prev,
        profileImage: response.data.profileImage, // Update with the new image URL
      }));
      setPreviewImage(null); // Clear the preview
    } catch (error) {
      console.error(
        "Error updating profile image:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile image");
    }
  };


  const handleLogout = () => {
    sessionStorage.clear();

    toast.success("Logout successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        className="right-side-modal-trainer"
        backdrop="static"
        dialogClassName="right-modal-dialog-trainer"
      >
        <Modal.Header closeButton className="close-modal">
          <Modal.Title>Trainer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="trainer-profile">
            {/* Profile Picture Section */}
            <div className="profile-picture-container-trainer">
              <div className="profile-picture-trainer">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="profile-image-trainer"
                  />
                ) : trainerProfile.profileImage ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${trainerProfile.profileImage}`}
                    alt="Profile"
                    className="profile-image-trainer"
                  />
                ) : (
                  <div className="">Upload</div>
                )}
              </div>

              {/* Styled File Upload Button */}
              <div className="file-upload-container-trainer">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />
                <label
                  htmlFor="file-upload"
                  className="file-upload-btn-trainer"
                >
                  <Upload className="upload-icon" />
                  Choose File
                </label>
              </div>
            </div>

            {/* User Details */}
            <h5>Trainer : {trainerProfile.username}</h5>
            <p style={{color:"green",fontWeight:"500"}}>Specialist: {trainerProfile.specialization}</p>

            <Button variant="success" onClick={handleSaveImage}>
              Save Image
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Toaster
        position="top-right"
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

export default TrainerProfile;
