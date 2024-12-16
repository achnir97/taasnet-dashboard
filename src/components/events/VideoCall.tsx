import React, { useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  HourglassEmpty,
} from "@mui/icons-material";
import { initAgora, joinChannel, leaveChannel, agoraService } from "../Agora/Boardcast";
import "../Agora/AgoraVideo.css";

interface VideoCallPageProps {
  title: string; // Title passed from the booking page
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({ title }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const setupAgora = async () => {
      try {
        await initAgora("local-video", "remote-container");
      } catch (error) {
        console.error("Agora initialization failed:", error);
        alert("Failed to initialize Agora. Please try again later.");
      }
    };

    setupAgora();

    return () => {
      leaveChannel().catch((error) => {
        console.error("Error during cleanup:", error);
      });
    };
  }, []);

  const handleJoinAsHost = async () => {
    setLoading(true);
    try {
      await joinChannel(true, "local-video");
      setIsStreaming(true);
    } catch (error) {
      console.error("Error joining call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    await leaveChannel();
    setIsStreaming(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = async () => {
    if (agoraService.localAudioTrack) {
      await agoraService.localAudioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (agoraService.localVideoTrack) {
      await agoraService.localVideoTrack.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="agora-video-container">
      <h1>{title || "Video Call"}</h1>

      {/* Video Grid */}
      <div className="video-grid horizontal">
        <div id="local-video" className="video-container">
          {loading && <HourglassEmpty className="spinner" />}
          {!isStreaming && <div className="placeholder">Your Video</div>}
        </div>
        <div id="remote-container" className="video-container">
          {!isStreaming && <div className="placeholder">Remote Video</div>}
        </div>
      </div>

      {/* Join Call Button */}
      {!isStreaming && (
        <div className="join-call-container">
          <button
            className="join-call-button"
            onClick={handleJoinAsHost}
            disabled={loading}
          >
            {loading ? <HourglassEmpty /> : "Join Call"}
          </button>
        </div>
      )}

      {/* Control Bar */}
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

export default VideoCallPage;
