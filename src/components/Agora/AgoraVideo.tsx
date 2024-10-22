// AgoraVideo.tsx
import React, { useEffect } from "react";
import { initAgora, joinChannel, leaveChannel } from "./Boardcast";
import "./AgoraVideo.css"; // Create this for custom styling if needed

const AgoraVideo: React.FC = () => {
  useEffect(() => {
    // Initialize Agora when the component mounts
    initAgora();

    return () => {
      // Cleanup when the component unmounts
      leaveChannel();
    };
  }, []);

  return (
    <div className="agora-video-container">
      <h1>Agora Live Streaming</h1>
      <div className="button-group">
        <button onClick={joinChannel}>Join as Host</button>
        <button onClick={leaveChannel}>Leave Channel</button>
      </div>
      <div id="video-container" className="video-container"></div>
    </div>
  );
};

export default AgoraVideo;
