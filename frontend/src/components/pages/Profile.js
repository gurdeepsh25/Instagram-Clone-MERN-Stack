import React, { useEffect, useState } from "react";
import "./Profile.css";
import { CiSettings } from "react-icons/ci";
import { PiUserLight } from "react-icons/pi";

function Profile() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const storedUsername = localStorage.getItem("username");
  const storedFullName = localStorage.getItem("fullName");

  useEffect(() => {
    const fetchProfileImage = async () => {
      const response = await fetch(
        `http://localhost:3001/profileImage/${storedUsername}`
      );
      const fetchedImage = await response.json();
      if (fetchedImage.profileImage) {
        const decodedImageName = decodeURIComponent(
          fetchedImage.profileImage
        ).replace(/\\/g, "/");
        const port = 3001;
        const imagePath = `${window.location.protocol}//localhost:${port}/${decodedImageName}`;
        setProfileImage(imagePath);
      }
    };
    fetchProfileImage();
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedFullName) {
      setFullName(storedFullName);
    }
  }, [storedUsername, storedFullName]);

  const handleImageClick = () => {
    // Open the modal only if there is a profile image
    if (profileImage) {
      setIsModalOpen(true);
    } else {
      // Trigger the file input click when the profile image is clicked and there is no image
      document.getElementById("profileImageInput").click();
    }
  };

  const handleFileChange = (event) => {
    // Handle file selection
    const file = event.target.files[0];
    uploadProfileImage(file);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        `http://localhost:3001/uploadProfileImage/${storedUsername}`,
        {
          method: "PATCH", // Use PATCH if your backend is configured for PATCH
          headers: {
            // Remove "Content-Type" header, as FormData sets it automatically
          },
          body: formData,
        }
      );
      const fetchedImage = await response.json();

      setProfileImage(fetchedImage.profileImage);
      closeModal();
      // Add logic to update the frontend UI if needed
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const removeProfileImage = async () => {
    await fetch(`http://localhost:3001/removeProfileImage/${storedUsername}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    setProfileImage(null);
    closeModal();
  };

  return (
    <div className="profile">
      <div className="profile-sub">
        <input
          type="file"
          id="profileImageInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="profile-img" onClick={handleImageClick}>
          {!profileImage ? (
            <PiUserLight className="profile-img-icon" />
          ) : (
            <img
              className="profile-img-img"
              src={profileImage}
              alt="profileImg"
              onClick={handleImageClick}
            />
          )}
        </div>
        <div className="profile-categories">
          <div className="profile-options">
            <span>{username}</span>
            <button>Edit Profile</button>
            <button>View archieve</button>
            <CiSettings className="profile-options-icon" />
          </div>
          <div className="profile-data">
            <span className="profile-data-span">
              <span className="profile-data-update">0</span>posts
            </span>
            <span className="profile-data-span">
              <span className="profile-data-update">0</span>followers
            </span>
            <span className="profile-data-span">
              <span className="profile-data-update">0</span>following
            </span>
          </div>
          <div className="profile-status">
            <h5>{fullName}</h5>
            <p>
              User Status: Transforming their digital presence with a status
              update.
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="profile-img-modal">
          <div className="modal-img">
            <h2>Change Profile Photo</h2>
            <button className="modal-img-btn1">Upload Photo</button>
            <button className="modal-img-btn2" onClick={removeProfileImage}>
              Remove Current Photo
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
