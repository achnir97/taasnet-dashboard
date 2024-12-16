import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import "./youtubeAdmin.css";

const YoutubeAdmin: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ"); // Default video ID
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [startTime, setStartTime] = useState<number>(0); // Start time in seconds
  const [endTime, setEndTime] = useState<number>(0); // End time in seconds
  const [pausedTime, setPausedTime] = useState<number>(0); // Last paused time
  const [currentAction, setCurrentAction] = useState<string>("pause"); // Default action
  const playerRef = useRef<any>(null);

  const saveApiUrl   = process.env.backend_url; // Save endpoint
  const updateApiUrl = process.env.backend_url; // Update endpoint
  const fetchApiUrl  = process.env.backend_url; // Fetch endpoint

  // On component load, fetch current video settings
  useEffect(() => {
    fetchCurrentSettings();
  }, []);
    
  // Fetch current video settings from the backend
  const fetchCurrentSettings = async () => {
    try {
      const response = await fetch(fetchApiUrl);
      if (response.ok) {
        const data = await response.json();
        const videoControl = data.video_control;
        if (videoControl) {
          setVideoId(extractVideoId(videoControl.video_url) || "dQw4w9WgXcQ");
          setVideoUrl(videoControl.video_url || "");
          setStartTime(videoControl.start_time || 0);
          setEndTime(videoControl.end_time || 0);
          setPausedTime(videoControl.paused_time || 0);
          setCurrentAction(videoControl.action || "pause");
        }
      } else {
        console.error("Error fetching video settings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching video settings:", error);
    }
  };

  // Save new video settings to the backend
  const saveSettings = async () => {
    try {
      const response = await fetch(saveApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          start_time: startTime,
          end_time: endTime,
          paused_time: startTime,
          action: "pause",
        }),
      });
      if (!response.ok) {
        console.error("Error saving video settings:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving video settings:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<{ paused_time: number; action: string }>) => {
    try {
      const payload = {
        paused_time: Math.floor(newSettings.paused_time || 0 ), // Truncate to integer
        action: newSettings.action,
      };
  
      console.log("Payload being sent:", payload); // Debugging step
  
      const response = await fetch(updateApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error("Error updating video settings:", response.statusText);
        const errorBody = await response.text();
        console.error("Response body:", errorBody);
      } else {
        console.log("Video settings updated successfully.");
      }
    } catch (error) {
      console.error("Error updating video settings:", error);
    }
  };
  

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:\?v=|\/embed\/|youtu\.be\/|\/v\/|&v=)([^&?/\s]{11})/);
    return match ? match[1] : "";
  };

  // Handle "Set" button click
// Handle "Set" button click
const handleSet = async () => {
  const extractedId = extractVideoId(videoUrl);
  if (extractedId) {
    setVideoId(extractedId); // Update video ID locally

    try {
      // Save settings to the backend
      const response = await fetch(saveApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          start_time: startTime,
          end_time: endTime,
          paused_time: startTime,
          action: "pause",
        }),
      });

      if (response.ok) {
        console.log("Settings saved successfully.");
        await fetchCurrentSettings(); // Re-fetch settings immediately after saving
        playerRef.current?.loadVideoById(extractedId, startTime); // Update player to new video and start time
        playerRef.current?.pauseVideo(); // Set to pause after loading
        setCurrentAction("pause");
      } else {
        console.error("Error saving video settings:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving video settings:", error);
    }
  } else {
    alert("Invalid YouTube URL. Please enter a valid URL.");
  }
};


  // Handle "Play" button click
  const handlePlay = () => {
    if (playerRef.current) {
      const resumeTime = pausedTime > 0 ? pausedTime : startTime;
      playerRef.current.seekTo(resumeTime);
      playerRef.current.playVideo();
      setCurrentAction("play");
      updateSettings({ paused_time: resumeTime, action: "play" });

      // Monitor to pause at the end time
      const monitorPlayback = setInterval(() => {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= endTime && endTime > 0) {
          playerRef.current.pauseVideo();
          setPausedTime(endTime);
          setCurrentAction("pause");
          updateSettings({ paused_time: endTime, action: "pause" });
          clearInterval(monitorPlayback);
        }
      }, 500);
    }
  };

  // Handle "Pause" button click
  const handlePause = () => {
    if (playerRef.current) {
      const currentPausedTime = playerRef.current.getCurrentTime();
      setPausedTime(currentPausedTime);
      playerRef.current.pauseVideo();
      setCurrentAction("pause");
      updateSettings({ paused_time: currentPausedTime, action: "pause" });
    }
  };

  return (
    <div className="youtube-admin-container">
      <h1 className="title">YouTube Video Admin</h1>
      <div className="card">
        {/* Input Form */}
        <div className="input-form">
          <label>
            Video URL:
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
            />
          </label>
          <label>
            Start Time (Minutes):
            <input
              type="number"
              value={(startTime / 60).toFixed(1)}
              step="0.1"
              onChange={(e) => setStartTime(parseFloat(e.target.value) * 60)}
            />
          </label>
          <label>
            End Time (Minutes):
            <input
              type="number"
              value={(endTime / 60).toFixed(1)}
              step="0.1"
              onChange={(e) => setEndTime(parseFloat(e.target.value) * 60)}
            />
          </label>
          <button className="set-btn" onClick={handleSet}>
            Set
          </button>
        </div>

        {/* YouTube Player */}
        <div className="video-container">
          <YouTube
            videoId={videoId}
            onReady={(event: YouTubeEvent) => (playerRef.current = event.target)}
            opts={{ playerVars: { autoplay: 0 } }}
          />
        </div>

        {/* Controls */}
        <div className="controls">
          <button className="play-btn" onClick={handlePlay}>
            Play
          </button>
          <button className="pause-btn" onClick={handlePause}>
            Pause
          </button>
        </div>

        {/* Status */}
        <div className={`status-badge ${currentAction}`}>
          {currentAction === "play" ? "Playing" : "Paused"}
        </div>
      </div>
    </div>
  );
};

export default YoutubeAdmin;