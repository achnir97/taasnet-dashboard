import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import "./youtubeAdmin.css";

const db = getFirestore();

const YoutubeAdmin: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ"); // Default video ID
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [startTime, setStartTime] = useState<number>(0); // Start in seconds
  const [endTime, setEndTime] = useState<number>(0); // End in seconds
  const [pausedTime, setPausedTime] = useState<number>(0); // Last paused time
  const [currentAction, setCurrentAction] = useState<string>("pause"); // Default action
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  // Fetch video settings from Firestore
  const fetchCurrentSettings = async () => {
    try {
      const docRef = doc(db, "adminControls", "videoControl");
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setVideoId(data.videoId || "dQw4w9WgXcQ");
        setVideoUrl(`https://www.youtube.com/watch?v=${data.videoId}`);
        setStartTime(data.startTime || 0);
        setEndTime(data.endTime || 0);
        setPausedTime(data.lastPausedTime || 0);
        setCurrentAction("pause");
      }
    } catch (error) {
      console.error("Error fetching video settings:", error);
    }
  };

  // Update video settings in Firestore
  const updateSettings = async (newSettings: Partial<{ videoId: string; startTime: number; endTime: number; lastPausedTime: number }>) => {
    try {
      const docRef = doc(db, "adminControls", "videoControl");
      await setDoc(docRef, newSettings, { merge: true });
    } catch (error) {
      console.error("Error updating Firebase:", error);
    }
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:\?v=|\/embed\/|youtu\.be\/|\/v\/|&v=)([^&?/\s]{11})/);
    return match ? match[1] : "";
  };

  // Handle Set Button Click
  const handleSet = () => {
    const extractedId = extractVideoId(videoUrl);
    if (extractedId) {
      setVideoId(extractedId);
      updateSettings({ videoId: extractedId, startTime, endTime, lastPausedTime: startTime });
      setCurrentAction("pause");
      playerRef.current?.pauseVideo();
    } else {
      alert("Invalid YouTube URL. Please enter a valid URL.");
    }
  };

  // Play Video
  const handlePlay = () => {
    if (playerRef.current) {
      const resumeTime = pausedTime > 0 ? pausedTime : startTime;
      playerRef.current.seekTo(resumeTime); // Start from paused time or start time
      playerRef.current.playVideo();
      setCurrentAction("play");

      // Monitor to pause at the end time
      const monitorPlayback = setInterval(() => {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= endTime && endTime > 0) {
          playerRef.current.pauseVideo();
          setPausedTime(endTime); // Update paused time as end time
          setCurrentAction("pause");
          updateSettings({ lastPausedTime: endTime });
          clearInterval(monitorPlayback);
        }
      }, 500);
    }
  };

  // Pause Video
  const handlePause = () => {
    if (playerRef.current) {
      const currentPausedTime = playerRef.current.getCurrentTime();
      setPausedTime(currentPausedTime); // Save paused position
      playerRef.current.pauseVideo();
      setCurrentAction("pause");
      updateSettings({ lastPausedTime: currentPausedTime });
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
