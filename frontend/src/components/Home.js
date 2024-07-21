import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// REACT ICONS
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { BsSendArrowDown } from "react-icons/bs";
import { RiBookmarkLine } from "react-icons/ri";
import { GoSmiley } from "react-icons/go";
import { PiUserLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";

function Home() {
  // STATE HOOKS
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [mediaData, setMediaData] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [isLikedArray, setIsLikedArray] = useState(
    Array(mediaData.length).fill(false)
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(null);

  const openCommentModal = (index) => {
    setCurrentPostIndex(index);
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setCurrentPostIndex(null);
    setIsCommentModalOpen(false);
  };

  const handleCommentSubmit = (comment) => {
    console.log(
      `Comment submitted for post index ${currentPostIndex}: ${comment}`
    );
    closeCommentModal();
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFullName = localStorage.getItem("fullName");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedFullName) {
      setFullName(storedFullName);
    }
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(
          `http://localhost:3001/api/fetchMedia?timestamp=${timestamp}`
        );
        const mediaData = await response.json();

        if (Array.isArray(mediaData)) {
          setMediaData(mediaData);
        } else {
          console.error("Invalid media data format:", mediaData);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, []);

  const handleVideoClick = (index) => {
    const videoElement = document.getElementById(`video-${index}`);
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  const handleToggleSound = (index) => {
    const videoElement = document.getElementById(`video-${index}`);
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
    }
  };

  useEffect(() => {
    setLikeCounts(Array(mediaData.length).fill(0));
  }, [mediaData]);

  const handleLikeClick = (index) => {
    const newLikeCounts = [...likeCounts];
    newLikeCounts[index] += 1;

    const newIsLikedArray = [...isLikedArray];
    newIsLikedArray[index] = true;

    setLikeCounts(newLikeCounts);
    setIsLikedArray(newIsLikedArray);
  };

  return (
    <div className="home">
      <div className="home-sub">
        <div className="home-left">
          <div className="home-stories">
            {mediaData.length === 0
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="home-story-placeholder">
                    <div className="home-story-outer-placeholder">
                      <div className="home-story-inner-placeholder"></div>
                    </div>
                    <span></span>
                  </div>
                ))
              : mediaData.slice(0, 8).map((media, index) => (
                  <div key={media.id || index} className="home-story">
                    <div className="home-story-outer">
                      <div className="home-story-inner">
                        {media.type === "image" ? (
                          <img src={media.url} alt="" />
                        ) : (
                          <PiUserLight className="home-story-inner-icon" />
                        )}
                      </div>
                    </div>
                    <span>{media.username}</span>
                  </div>
                ))}
          </div>
          <div className="home-posts">
            {mediaData.length === 0 ? (
              <div className="home-post">
                <div className="home-post-header">
                  <div className="home-post-header-left">
                    <div className="post-header-outer">
                      <div className="post-header-inner"></div>
                    </div>
                    <span className="home-post-header-left-span1"></span>
                    <span className="home-post-header-left-span2"></span>
                  </div>
                  <div className="home-post-header-right"></div>
                </div>
                <div className="home-post-imgvid"></div>
                <div className="home-post-footer">
                  <div className="post-footer-icons">
                    <div className="post-footer-icons-left"></div>
                    <div className="post-footer-icons-right"></div>
                  </div>
                  <div className="post-footer-likesviews">
                    <div className="post-footer-likeview">
                      <span></span>
                      <span></span>
                    </div>
                    <div className="post-footer-likeview">
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="post-footer-description">
                    <span></span>
                    <p></p>
                  </div>
                  <div className="post-footer-comments">
                    <span>
                      <span></span>
                    </span>
                    <div className="post-footer-comments-sub"></div>
                  </div>
                </div>
              </div>
            ) : (
              mediaData.map((media, index) => (
                <div key={media.id || index} className="home-post">
                  <div className="home-post-header">
                    <div className="home-post-header-left">
                      <div className="post-header-outer">
                        <div className="post-header-inner">
                          {media.type === "image" ? (
                            <img src={media.url} alt="" />
                          ) : (
                            <PiUserLight className="post-header-inner-icon" />
                          )}
                        </div>
                      </div>
                      <span className="home-post-header-left-span1">
                        {media.username}
                      </span>
                      <span className="home-post-header-left-span2">• 0m</span>
                    </div>
                    <div className="home-post-header-right">
                      <BsThreeDots className="home-post-header-right-icon" />
                    </div>
                  </div>
                  <div
                    className="home-post-imgvid"
                    onClick={() => handleVideoClick(index)}
                  >
                    {media.type === "image" ? (
                      <img src={media.url} alt="" />
                    ) : (
                      <video
                        id={`video-${index}`}
                        controls={false}
                        loop
                        muted
                        autoPlay
                        onClick={() => handleToggleSound(index)}
                      >
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="home-post-footer">
                    <div className="post-footer-icons">
                      <div className="post-footer-icons-left">
                        {isLikedArray[index] ? (
                          <FaHeart
                            className="post-footer-icons-icon liked"
                            onClick={() => handleLikeClick(index)}
                          />
                        ) : (
                          <FaRegHeart
                            className="post-footer-icons-icon"
                            onClick={() => handleLikeClick(index)}
                          />
                        )}
                        <LuMessageCircle
                          className="post-footer-icons-icon post-footer-icons-icon-m"
                          onClick={openCommentModal}
                        />
                        {isCommentModalOpen && (
                          <div className="comment-modal-overlay ">
                            <div className="comment-modal">
                              <div className="comment-modal-left"></div>
                              <div className="comment-modal-right">
                                <div className="comment-modal-header">
                                  <div className="comment-modal-header-left">
                                    <div className="comment-modal-header-outer">
                                      <div className="comment-modal-header-inner"></div>
                                    </div>
                                    <span>Username</span>
                                  </div>
                                  <div className="comment-modal-header-right">
                                    <BsThreeDots className="comment-modal-header-right-icon" />
                                  </div>
                                </div>
                                <div className="comment-modal-comment-mains">
                                  <div className="comment-modal-comments">
                                    <div className="comment-modal-header-outer">
                                      <div className="comment-modal-header-inner"></div>
                                    </div>
                                    <div className="comment-modal-comments-sub">
                                      <div className="modal-comments-main">
                                        <span className="modal-comments-main-bold">
                                          Username
                                        </span>
                                        <span>
                                          Comments will shown up here...
                                        </span>
                                      </div>
                                      <div className="modal-comments-options">
                                        <span>0 m</span>
                                        <span>0 likes</span>
                                        <span>Reply</span>
                                      </div>
                                    </div>
                                    <div className="modal-comments-icons">
                                      <FaRegHeart className="modal-comments-icons-icon" />
                                    </div>
                                  </div>
                                </div>
                                <div className="comment-modal-icons-likes">
                                  <div className="comment-modal-icons">
                                    <div className="comment-modal-icons-left">
                                      <FaRegHeart className="comment-modal-icons-icon" />
                                      <LuMessageCircle className="comment-modal-icons-icon" />
                                      <BsSendArrowDown className="comment-modal-icons-icon" />
                                    </div>
                                    <div className="comment-modal-icons-right">
                                      <RiBookmarkLine className="comment-modal-icons-icon" />
                                    </div>
                                  </div>
                                  <div className="comment-modal-likes">
                                    <span>0</span>
                                    <span>likes</span>
                                  </div>
                                </div>
                                <div className="comment-modal-footer">
                                  <div className="comment-modal-footer-left">
                                    <GoSmiley className="comment-modal-foote-icon" />
                                    <input
                                      type="text"
                                      placeholder="Add a comment..."
                                    ></input>
                                  </div>
                                  <div className="comment-modal-footer-right">
                                    <span>Post</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              className="modal-comment-close"
                              onClick={closeCommentModal}
                            >
                              <RxCross1 className="modal-comment-close-icon" />
                            </button>
                          </div>
                        )}
                        <BsSendArrowDown className="post-footer-icons-icon post-footer-icons-icon-m" />
                      </div>
                      <div className="post-footer-icons-right">
                        <RiBookmarkLine className="post-footer-icons-icon" />
                      </div>
                    </div>
                    <div className="post-footer-likesviews">
                      <div className="post-footer-likeview">
                        <span>{likeCounts[index]}</span>
                        <span>likes</span>
                      </div>
                      <div className="post-footer-likeview">
                        <span>0</span>
                        <span>views</span>
                      </div>
                    </div>
                    <div className="post-footer-description">
                      <span>{media.username}</span>
                      <p>{media.description || "No description available."}</p>
                    </div>
                    <div className="post-footer-comments">
                      <span>
                        View all <span>0</span> comments
                      </span>
                      <div className="post-footer-comments-sub">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                        ></input>
                        <GoSmiley className="post-footer-comments-sub-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="home-right">
          <div className="home-right-profile">
            <div className="home-right-profile-left">
              <div className="home-profile-outer">
                <PiUserLight className="home-profile-outer-icon" />
              </div>
              <div className="home-profile-name">
                <span className="home-profile-name-username">{username}</span>
                <span className="home-profile-name-fullname">{fullName}</span>
              </div>
            </div>
            <div className="home-right-profile-right">
              <Link to="/login" className="home-right-profile-right-link">
                <span>Switch</span>
              </Link>
            </div>
          </div>
          <div className="home-suggestions">
            <div className="home-suggestion-header">
              <span className="home-suggestion-header-left">
                Suggested for you
              </span>
              <span className="home-suggestion-header-right">See All</span>
            </div>
            <div className="home-suggestion-profile">
              {mediaData.length === 0 ? (
                <p>
                  Fetching Suggested Profiles (Profile Images, Usernames &
                  Fullnames) from Pixel & Nasa API ...
                </p>
              ) : (
                mediaData.slice(0, 5).map((nasaItem, index) => (
                  <div key={index} className="home-right-profile">
                    <div className="home-right-profile-left">
                      <div className="home-profile-outer">
                        {nasaItem.type === "image" ? (
                          <img src={nasaItem.url} alt="" />
                        ) : (
                          <PiUserLight className="home-profile-outer-icon" />
                        )}
                      </div>
                      <div className="home-profile-name">
                        <span className="home-profile-name-username">
                          {nasaItem.username || "Username"}
                        </span>
                        <span className="home-profile-name-fullname">
                          {nasaItem.description || "Fullname"}
                        </span>
                      </div>
                    </div>
                    <div className="home-right-profile-right">
                      <span>Follow</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="home-suggestion-footer">
              <span className="suggestion-footer-main">
                <span>About</span>
                <span>.</span>
                <span>Help</span>
                <span>.</span>
                <span>Press</span>
                <span>.</span>
                <span>API</span>
                <span>.</span>
                <span>Jobs</span>
                <span>.</span>
                <span>Privacy</span>
                <span>.</span>
                <span>Terms</span>
                <span>.</span>
              </span>
              <span className="suggestion-footer-main">
                <span>Locations</span>
                <span>.</span>
                <span>Language</span>
                <span>.</span>
                <span>Meta Verified</span>
              </span>
              <span className="suggestion-2023insta">
                © 2023 INSTAGRAM FROM META
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
