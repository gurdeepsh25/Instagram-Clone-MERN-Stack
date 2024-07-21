import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import "./Navbar.css";

// REACT ICONS
import { FaInstagram } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { FaRegCompass } from "react-icons/fa";
import { CgClapperBoard } from "react-icons/cg";
import { RiMessengerLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoMention } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { LiaBookmark } from "react-icons/lia";
import { BiSun } from "react-icons/bi";
import { BiMessageAltError } from "react-icons/bi";
import { PiUserLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { GoArrowLeft } from "react-icons/go";
import { PiImagesThin } from "react-icons/pi";
import { GoSmiley } from "react-icons/go";
import { GoLocation } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";

function Navbar() {
  const storedUsername = localStorage.getItem("username");
  const storedFullName = localStorage.getItem("fullName");
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
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

  // DARK MODE CONTEXT
  const { toggleDarkMode } = useDarkMode();

  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // CREATE MODAL STATE
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [finalPreview, setFinalPreview] = useState(false);

  // DISCARD MODAL STATE
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  // FILE PREVIEW STATE
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // FILE TYPE STATE
  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const [fileType, setFileType] = useState(null);

  // WORD COUNT STATE
  const [wordCount, setWordCount] = useState(0);
  const [caption, setCaption] = useState("");

  // LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

  // RENDERING USERNAME FROM LOCAL STORAGE
  const [username, setUsername] = useState("");

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLERS
  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModal = (index) => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (finalPreview) {
      setFinalPreview(false);
    } else {
      setIsCreateModalOpen(false);
    }
  };

  const handleDiscard = () => {
    if (finalPreview) {
      setFinalPreview(false);
    } else {
      setIsDiscardModalOpen(true);
    }
  };

  const handleCloseDiscardModal = () => {
    setIsDiscardModalOpen(false);
  };

  const handleConfirmDiscard = () => {
    setFilePreview(null);
    setIsDiscardModalOpen(false);
  };

  const handleCaptionChange = (event) => {
    const newCaption = event.target.value;

    // Calculate letter count, space count, and number count
    const letterCount = (newCaption.match(/[a-zA-Z]/g) || []).length;
    const spaceCount = (newCaption.match(/\s/g) || []).length;
    const numberCount = (newCaption.match(/\d/g) || []).length;

    // Calculate total count (letters + spaces + numbers)
    const totalCount = letterCount + spaceCount + numberCount;

    // Enforce the 2200-character limit
    if (totalCount > 2200) {
      return;
    }

    setCaption(newCaption);
    setWordCount(totalCount);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userToken");

      const response = await fetch("http://localhost:3001/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({}),
      });

      if (!response.ok) {
        console.error("Logout failed:", response.statusText);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleFileSelect = (event) => {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files.length > 0) {
      const file = files[0];
      const fileType = file.type; // Define fileType here
      setFileType(fileType);
      const validVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/x-matroska",
      ];

      if (
        validImageTypes.includes(fileType) ||
        validVideoTypes.includes(fileType)
      ) {
        setSelectedFile(file);

        if (validImageTypes.includes(fileType)) {
          // For images, generate a data URL preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else if (validVideoTypes.includes(fileType)) {
          // For supported video types, you can set the video file directly
          setFilePreview(URL.createObjectURL(file));
        } else {
          // Handle MKV or other unsupported video types here (e.g., convert to MP4 for preview)
          alert(
            "Unsupported video format. Consider converting to a supported format for preview."
          );
          fileInput.value = "";
        }
      } else {
        alert("Invalid file type. Please select an image or video.");
        fileInput.value = "";
      }
    }
  };

  // STATE MANAGEMENT
  const handleOusideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOusideClick);
    } else {
      document.removeEventListener("mousedown", handleOusideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOusideClick);
    };
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // LOADING INDICATOR TIMEOUT
  const setLoadingTimeout = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // HANDLE NAVBAR OPTION CLICK
  const handleNavbarOptionClick = () => {
    setIsLoading(true);
    setLoadingTimeout();
  };

  // State to keep track of the active link
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem("activeLink") || null;
  });

  // UseLocation hook from React Router to get the current route
  const location = useLocation();

  // Function to handle click on navigation links
  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };

  // UseEffect to set the active link based on the current route
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/") {
      setActiveLink("home");
    } else if (currentPath === "/search") {
      setActiveLink("search");
    } else if (currentPath === "/explore") {
      setActiveLink("explore");
    } else if (currentPath === "/reels") {
      setActiveLink("reels");
    } else if (currentPath === "/messages") {
      setActiveLink("messages");
    } else if (currentPath === "/notifications") {
      setActiveLink("notifications");
    } else if (currentPath === "/profile") {
      setActiveLink("profile");
    }
  }, [location.pathname]);

  return (
    <div className="navbar">
      <div className="navbar-sub">
        <Link
          to="/"
          className="navbar-sub-link"
          onClick={() => window.location.reload()}
        >
          <span className="navbar-logo">Instagram</span>
          <span className="navbar-logo-icon-only">
            <FaInstagram />
          </span>
        </Link>
        <div className="navbar-options">
          <Link
            to="/"
            className={`navbar-option-link ${
              activeLink === "home" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("home");
            }}
          >
            <div className="navbar-option navbar-option-home">
              <GoHomeFill className="navbar-option-icon" />
              <span>Home</span>
            </div>
          </Link>
          <Link
            to="/search"
            className={`navbar-option-link ${
              activeLink === "search" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("search");
            }}
          >
            <div className="navbar-option navbar-option-search">
              <FiSearch className="navbar-option-icon" />
              <span>Search</span>
            </div>
          </Link>
          <Link
            to="/explore"
            className={`navbar-option-link ${
              activeLink === "explore" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("explore");
            }}
          >
            <div className="navbar-option navbar-option-explore">
              <FaRegCompass className="navbar-option-icon" />
              <span>Explore</span>
            </div>
          </Link>
          <Link
            to="/reels"
            className={`navbar-option-link ${
              activeLink === "reels" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("reels");
            }}
          >
            <div className="navbar-option navbar-option-reels">
              <CgClapperBoard className="navbar-option-icon" />
              <span>Reels</span>
            </div>
          </Link>
          <Link
            to="/messages"
            className={`navbar-option-link ${
              activeLink === "messages" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("messages");
            }}
          >
            <div className="navbar-option navbar-option-messages">
              <RiMessengerLine className="navbar-option-icon" />
              <span>Messages</span>
            </div>
          </Link>
          <Link
            to="/notifications"
            className={`navbar-option-link ${
              activeLink === "notifications" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("notifications");
            }}
          >
            <div className="navbar-option navbar-option-heart">
              <FaRegHeart className="navbar-option-icon" />
              <span>Notifications</span>
            </div>
          </Link>
          <div
            className="navbar-option navbar-option-create"
            onClick={() => {
              openCreateModal();
              handleNavbarOptionClick();
            }}
          >
            <TbSquareRoundedPlus className="navbar-option-icon" />
            <span>Create</span>
          </div>
          {isCreateModalOpen && (
            <div className="create-modal-overlay ">
              <div className="create-modal">
                <div className="create-modal-header">
                  {filePreview ? (
                    <>
                      <span onClick={handleDiscard}>
                        <GoArrowLeft className="create-modal-header-icon" />
                      </span>
                      {finalPreview ? (
                        <>
                          <span className="create-modal-header-heading">
                            Create new post
                          </span>
                          <span
                            className="create-modal-header-blue"
                            onClick={() => setFinalPreview(true)}
                          >
                            Share
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="create-modal-header-heading">
                            Crop
                          </span>
                          <span
                            className="create-modal-header-blue"
                            onClick={() => setFinalPreview(true)}
                          >
                            Next
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="create-modal-header-heading">
                      Create new post
                    </span>
                  )}
                </div>
                <div className="create-modal-body">
                  <div className="create-modal-body-left">
                    {filePreview ? (
                      validImageTypes.includes(fileType) ? (
                        <img src={filePreview} alt="Preview" />
                      ) : (
                        <video
                          controls
                          width="100%"
                          height="100%"
                          onError={(e) => console.error("Video error:", e)}
                        >
                          <source src={filePreview} type={fileType} />
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <>
                        <PiImagesThin className="create-modal-body-icon" />
                        <span>Drag photos and videos here</span>
                        <div className="create-modal-body-input">
                          <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileSelect}
                          />
                          <label htmlFor="fileInput">
                            Select from computer
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                  {finalPreview ? (
                    <div className="create-modal-body-right">
                      <div className="create-right-one">
                        <div className="create-right-one-profile">
                          <div className="create-right-profile-outer">
                            <PiUserLight className="create-right-profile-outer-icon" />
                          </div>
                          <span>{username}</span>
                        </div>
                        <textarea
                          placeholder="Write a caption..."
                          onChange={handleCaptionChange}
                          value={caption}
                        ></textarea>
                        <div className="create-right-one-footer">
                          <GoSmiley className="create-right-one-footer-icon" />
                          <span>
                            <span>{wordCount}</span>/<span>2,200</span>
                          </span>
                        </div>
                      </div>
                      <div className="create-right-two">
                        <span>Add location</span>
                        <GoLocation className="create-right-two-icon" />
                      </div>
                      <div className="create-right-two">
                        <span className="create-right-two-span">
                          Accessibility
                        </span>
                        <MdKeyboardArrowDown className="create-right-two-icon" />
                      </div>
                      <div className="create-right-two">
                        <span className="create-right-two-span">
                          Advance settings
                        </span>
                        <MdKeyboardArrowDown className="create-right-two-icon" />
                      </div>
                      <div className="create-right-three">
                        <p>
                          Your reel will be shared with your followers in their
                          feeds and can be seen on your profile. It may also
                          appear in places like Reels, where anyone can see it.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <button className="modal-create-close" onClick={closeCreateModal}>
                <RxCross1 className="modal-create-close-icon" />
              </button>
            </div>
          )}
          {isDiscardModalOpen && (
            <div className="discard-modal-overlay">
              <div className="discard-modal">
                <h5>Discard post?</h5>
                <p>If you leave, your edits won't be saved.</p>
                <button
                  className="discard-modal-btn1"
                  onClick={handleConfirmDiscard}
                >
                  Discard
                </button>
                <button onClick={handleCloseDiscardModal}>Cancel</button>
              </div>
            </div>
          )}
          <Link
            to="/profile"
            className={`navbar-option-link ${
              activeLink === "profile" ? "active" : ""
            }`}
            onClick={() => {
              handleNavbarOptionClick();
              handleNavLinkClick("profile");
            }}
          >
            <div className="navbar-option navbar-option-profile-main">
              <div className="navbar-option-profile">
                {!profileImage ? (
                  <PiUserLight className="profile-img-icon" />
                ) : (
                  <img
                    className="profile-img-img"
                    src={profileImage}
                    alt="profileImg"
                  />
                )}
              </div>
              <span>Profile</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="navbar-footer-options">
        <a
          href="https://www.threads.net/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="navbar-option">
            <GoMention className="navbar-option-icon" />
            <span>Threads</span>
          </div>
        </a>
        <div className="navbar-option" onClick={handleOpenModal}>
          <RxHamburgerMenu className="navbar-option-icon" />
          <span>More</span>
        </div>
      </div>
      {isModalOpen && (
        <div className="navbar-modal" ref={modalRef}>
          <div className="navbar-modal-options">
            <div className="navbar-modal-option">
              <CiSettings className="navbar-modal-option-icon" />
              <span>Settings</span>
            </div>
            <div className="navbar-modal-option">
              <CiImageOn className="navbar-modal-option-icon" />
              <span>Your activity</span>
            </div>
            <div className="navbar-modal-option">
              <LiaBookmark className="navbar-modal-option-icon" />
              <span>Saved</span>
            </div>
            <div className="navbar-modal-option" onClick={handleDarkModeToggle}>
              <BiSun className="navbar-modal-option-icon" />
              <span>Switch appearance</span>
            </div>
            <div className="navbar-modal-option">
              <BiMessageAltError className="navbar-modal-option-icon" />
              <span>Report a problem</span>
            </div>
          </div>
          <div className="navbar-modal-others">
            <div className="navbar-modal-option">
              <span>Switch accounts</span>
            </div>
            <div className="navbar-modal-option" onClick={handleLogout}>
              <span>Log out</span>
            </div>
          </div>
        </div>
      )}
      {isLoading && <div className="loading-indicator"></div>}
    </div>
  );
}

export default Navbar;
