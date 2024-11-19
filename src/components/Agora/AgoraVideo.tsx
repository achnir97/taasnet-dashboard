import React, { useEffect, useState } from "react";
import { Mic, MicOff, Videocam, VideocamOff, CallEnd } from '@mui/icons-material';
import { initAgora, joinChannel, leaveChannel, agoraService } from "./Boardcast";
import "./AgoraVideo.css";


const AgoraVideo: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    initAgora("local-video", "remote-container");

    return () => {
      leaveChannel();
    };
  }, []);

  const handleJoinAsHost = async () => {
    setLoading(true);
    await joinChannel(true, "local-video");
    setLoading(false);
    setIsStreaming(true);
  };

  const handleJoinAsAudience = async () => {
    setLoading(true);
    await joinChannel(false, "local-video");
    setLoading(false);
    setIsStreaming(true);
  };

  const handleLeave = async () => {
    await leaveChannel();
    setIsStreaming(false);
    setIsMuted(false); // Reset mute state
    setIsVideoOff(false); // Reset video state
  };

  const toggleMute = async () => {
    try {
      setIsMuted((prevState) => !prevState);
      const muteStatus = !isMuted;
      if (agoraService.localAudioTrack) {
        muteStatus
          ? await agoraService.localAudioTrack.setEnabled(false)
          : await agoraService.localAudioTrack.setEnabled(true);
      }
    } catch (error) {
      console.error("Failed to toggle mute state:", error);
    }
  };

  const toggleVideo = async () => {
    try {
      setIsVideoOff((prevState) => !prevState);
      const videoStatus = !isVideoOff;
      if (agoraService.localVideoTrack) {
        videoStatus
          ? await agoraService.localVideoTrack.setEnabled(false)
          : await agoraService.localVideoTrack.setEnabled(true);
      }
    } catch (error) {
      console.error("Failed to toggle video state:", error);
    }
  };

  const handleRemoteUserLeft = (userId: number) => {
    setNotification(`User ${userId} has left the call.`);
    setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
  };

  return (
    <div className="agora-video-container">
      <h1>TaaSNet Coffee Call</h1>

      {/* Notification */}
      {notification && <div className="notification show">{notification}</div>}

      {/* Video Grid */}
      <div className="video-grid">
        {/* Local Video Container */}
        <div id="local-video" className="video-container">
          {!isStreaming && <div className="placeholder">Local Video</div>}
        </div>

        {/* Remote Videos Parent Container */}
        <div id="remote-container" className="video-container">
          {!isStreaming && <div className="placeholder">Remote Video</div>}
        </div>
      </div>

      {!isStreaming && (
        <div className="button-group">
          <button onClick={handleJoinAsHost} disabled={loading}>
            {loading ? "Joining as Host..." : "Join as Host"}
          </button>
          <button onClick={handleJoinAsAudience} disabled={loading}>
            {loading ? "Joining as Audience..." : "Join as Audience"}
          </button>
        </div>
      )}

      {isStreaming && (
       
<div className="control-bar">
  <button className="control-button" onClick={toggleMute}>
    {isMuted ? <MicOff /> : <Mic />}
  </button>

  <button className="control-button" onClick={toggleVideo}>
    {isVideoOff ? <VideocamOff /> : <Videocam />}
  </button>

  <button className="control-button leave" onClick={handleLeave}>
    <CallEnd />
  </button>
</div>
      )}
    </div>
  );
};

export default AgoraVideo;
