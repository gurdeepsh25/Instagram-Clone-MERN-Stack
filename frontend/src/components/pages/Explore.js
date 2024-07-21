import React, { useState, useEffect } from "react";
import "./Explore.css";

function Explore() {
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/fetchMedia")
      .then((response) => response.json())
      .then((data) => setMediaData(data))
      .catch((error) => console.error("Error fetching media:", error));
  }, []);

  return (
    <div className="explore">
      <div className="explore-sub">
        <div className="feed">
          <div className="grid">
            {mediaData.slice(0, 4).map((item, index) => (
              <div key={index} className={`grid__item item${index + 1}`}>
                {item.type === "image" ? (
                  <img src={item.url} alt={item.username} />
                ) : (
                  <video className="grid-item-video " controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
            {mediaData.slice(4, 5).map((item, index) => (
              <div key={index} className={`grid__item item${index + 1}`}>
                {item.type === "image" ? (
                  <img src={item.url} alt={item.username} />
                ) : (
                  <video className="grid-item-video " controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
          <div className="grid">
            {mediaData.slice(5, 9).map((item, index) => (
              <div key={index + 5} className={`grid__item item${index + 7}`}>
                {item.type === "image" ? (
                  <img src={item.url} alt={item.username} />
                ) : (
                  <video className="grid-item-video " controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
            {mediaData.slice(9, 10).map((item, index) => (
              <div key={index + 5} className={`grid__item item10`}>
                {item.type === "image" ? (
                  <img src={item.url} alt={item.username} />
                ) : (
                  <video className="grid-item-video " controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
