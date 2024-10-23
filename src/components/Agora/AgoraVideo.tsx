import React, { useEffect, useState } from "react";
import { initAgora, joinChannel, leaveChannel } from "./Boardcast";
import "./AgoraVideo.css";

const AgoraVideo: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false); // State to track if streaming is active
  const [loading, setLoading] = useState(false); // State to show loading feedback

  useEffect(() => {
    // Initialize Agora with the IDs for local and remote video containers
    initAgora("local-video", "remote-video");

    return () => {
      // Cleanup when the component unmounts
      leaveChannel();
    };
  }, []);

  // Handle joining the channel as a host
  const handleJoinAsHost = async () => {
    setLoading(true);
    await joinChannel(true, "local-video"); // Join as host (true)
    setLoading(false);
    setIsStreaming(true); // Set streaming to true when the user joins the channel
  };

  // Handle joining the channel as audience
  const handleJoinAsAudience = async () => {
    setLoading(true);
    await joinChannel(false, "remote-video"); // Join as audience (false)
    setLoading(false);
    setIsStreaming(true); // Set streaming to true when the user joins as audience
  };

  // Handle leaving the channel
  const handleLeave = async () => {
    await leaveChannel();
    setIsStreaming(false); // Set streaming to false when the user leaves the channel
  };

  return (
    <div className="agora-video-container">
      <h1>Taasnet Live Streaming</h1>

      <div className="button-group">
        {!isStreaming ? (
          <>
            <button onClick={handleJoinAsHost} disabled={loading}>
              {loading ? "Joining as Host..." : "Join as Host"}
            </button>
            {/* <button onClick={handleJoinAsAudience} disabled={loading}>
              {loading ? "Joining as Audience..." : "Join as Audience"}
            </button> */}
          </>
        ) : (
          <button onClick={handleLeave}>Leave Channel</button>
        )}
      </div>

      <div className="video-section">
       
        {/* Video container for the host */}
        <div id="local-video" className={`video-container ${isStreaming ? 'active' : ''}`}></div>
        
      </div>
    </div>
  );
};

export default AgoraVideo;
