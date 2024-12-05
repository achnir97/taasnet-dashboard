import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import "./youtubeAdmin.css";

const db = getFirestore();

const YoutubeAdmin = () => {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ");
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [action, setAction] = useState<string>("pause");
  const [startTime, setStartTime] = useState<number>(0); // in seconds
  const [endTime, setEndTime] = useState<number>(0); // in seconds
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchCurrentSettings();
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch video settings from Firestore
  const fetchCurrentSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "adminControls", "videoControl");
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setVideoId(data.videoId || "dQw4w9WgXcQ");
        setVideoUrl(`https://www.youtube.com/watch?v=${data.videoId}` || "");
        setAction(data.action || "pause");
        setStartTime(data.startTime || 0);
        setEndTime(data.endTime || 0);
      } else {
        setError("No settings found. Please configure video settings.");
      }
    } catch (err) {
      setError("Failed to fetch video settings. Please try again.");
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update video settings in Firestore
  const updateFirebase = async (state: Partial<{ 
    action: string; 
    videoId: string; 
    startTime: number; 
    endTime: number; 
    currentTime?: number; 
  }>) => {
    try {
      const docRef = doc(db, "adminControls", "videoControl");
      if (Object.keys(state).length > 0) {
        await updateDoc(docRef, state);
      }
    } catch (err) {
      console.error("Error updating Firebase:", err);
    }
  };

  // Extract videoId from YouTube URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|&v=)([^&?/\s]{11})/);
    return match ? match[1] : "";
  };

  // Handle video URL change
  const handleVideoUrlChange = (url: string) => {
    const extractedVideoId = extractVideoId(url);
    if (extractedVideoId) {
      setVideoId(extractedVideoId);
      setVideoUrl(url);
      updateFirebase({ videoId: extractedVideoId });
    } else {
      setError("Invalid YouTube URL. Please try again.");
    }
  };

  // Handle Play/Pause toggle
  const handlePlayPause = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newAction = action === "playRange" ? "pause" : "playRange";
      setAction(newAction);

      if (newAction === "playRange") {
        playerRef.current.seekTo(startTime);
        playerRef.current.playVideo();
        if (endTime > startTime) {
          setTimeout(() => {
            if (playerRef.current && action === "playRange") {
              playerRef.current.pauseVideo();
              setAction("pause");
              updateFirebase({ action: "pause" });
            }
          }, (endTime - startTime) * 1000);
        }
      } else {
        playerRef.current.pauseVideo();
      }

      updateFirebase({ action: newAction, currentTime });
    }
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin YouTube Control</h1>

      {loading ? (
        <div className="admin-status">Loading video settings...</div>
      ) : error ? (
        <div className="admin-status admin-error">{error}</div>
      ) : (
        <>
          {/* Input Form */}
          <div className="admin-form-card">
            <label className="admin-form-label">
              Video URL:
              <input
                type="text"
                value={videoUrl}
                placeholder="Paste YouTube URL here"
                className="admin-form-input"
                onChange={(e) => handleVideoUrlChange(e.target.value)}
              />
            </label>
            <label className="admin-form-label">
              Start Time (Minutes):
              <input
                type="number"
                step="0.1"
                value={(startTime / 60).toFixed(1)} // Convert seconds to minutes
                placeholder="Start time in minutes"
                className="admin-form-input"
                onChange={(e) => setStartTime(parseFloat(e.target.value) * 60)}
              />
            </label>
            <label className="admin-form-label">
              End Time (Minutes):
              <input
                type="number"
                step="0.1"
                value={(endTime / 60).toFixed(1)} // Convert seconds to minutes
                placeholder="End time in minutes"
                className="admin-form-input"
                onChange={(e) => setEndTime(parseFloat(e.target.value) * 60)}
              />
            </label>
          </div>

          {/* Video Player */}
          <div className="admin-video-card">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={(event: YouTubeEvent) => (playerRef.current = event.target)}
            />
          </div>

          {/* Progress Bar */}
          <div className="admin-progress">
            <div
              className="admin-progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>

          {/* Current Status */}
          <StatusBadge action={action} />

          {/* Controls */}
          <div className="admin-controls">
            <button
              className={`admin-button ${action === "playRange" ? "pause" : "play"}`}
              onClick={handlePlayPause}
              aria-label={action === "playRange" ? "Pause Video" : "Play Video"}
            >
              {action === "playRange" ? "Pause" : "Play"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ action }: { action: string }) => {
  const badgeStyles =
    action === "playRange" ? "badge badge-play" : action === "pause" ? "badge badge-pause" : "badge";
  return <div className={badgeStyles}>{action === "playRange" ? "Playing Range" : "Paused"}</div>;
};

export default YoutubeAdmin;
