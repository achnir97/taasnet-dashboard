import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
<<<<<<< HEAD
import "./youtubeAdmin.css";

const YoutubeAdmin: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ"); // Default video ID
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [startTime, setStartTime] = useState<number>(0); // Start time in seconds
  const [endTime, setEndTime] = useState<number>(0); // End time in seconds
  const [pausedTime, setPausedTime] = useState<number>(0); // Last paused time
  const [currentAction, setCurrentAction] = useState<string>("pause"); // Default action
  const playerRef = useRef<any>(null);

  const saveApiUrl   = "http://222.112.183.197:8086/api/save-video-control"; // Save endpoint
  const updateApiUrl = "http://222.112.183.197:8086/api/update-video-control"; // Update endpoint
  const fetchApiUrl  = "http://222.112.183.197:8086/api/get-video-control"; // Fetch endpoint

  // On component load, fetch current video settings
  useEffect(() => {
    fetchCurrentSettings();
  }, []);
    
  // Fetch current video settings from the backend
=======
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SaveIcon from "@mui/icons-material/Save";

const YoutubeAdmin: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ");
  const [videoUrl, setVideoUrl] = useState<string>(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<string>("pause");
  const playerRef = useRef<any>(null);

  const saveApiUrl = "http://222.112.183.197:8086/api/save-video-control";
  const fetchApiUrl = "http://222.112.183.197:8086/api/get-video-control";

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

>>>>>>> 5c11e67 (changes)
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
<<<<<<< HEAD
      } else {
        console.error("Error fetching video settings:", response.statusText);
=======
>>>>>>> 5c11e67 (changes)
      }
    } catch (error) {
      console.error("Error fetching video settings:", error);
    }
  };

<<<<<<< HEAD
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
=======
>>>>>>> 5c11e67 (changes)
  const extractVideoId = (url: string): string => {
    const match = url.match(
      /(?:\?v=|\/embed\/|youtu\.be\/|\/v\/|&v=)([^&?/\s]{11})/
    );
    return match ? match[1] : "";
  };

<<<<<<< HEAD
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
=======
  const handleSet = async () => {
    const extractedId = extractVideoId(videoUrl);
    if (extractedId) {
      setVideoId(extractedId);
      try {
        await fetch(saveApiUrl, {
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
        console.log("Settings saved successfully.");
        playerRef.current?.loadVideoById(extractedId, startTime);
        playerRef.current?.pauseVideo();
        setCurrentAction("pause");
      } catch (error) {
        console.error("Error saving video settings:", error);
      }
    } else {
      alert("Invalid YouTube URL. Please enter a valid URL.");
    }
  };

>>>>>>> 5c11e67 (changes)
  const handlePlay = () => {
    if (playerRef.current) {
      const resumeTime = pausedTime > 0 ? pausedTime : startTime;
      playerRef.current.seekTo(resumeTime);
      playerRef.current.playVideo();
      setCurrentAction("play");
<<<<<<< HEAD
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
=======
    }
  };

>>>>>>> 5c11e67 (changes)
  const handlePause = () => {
    if (playerRef.current) {
      const currentPausedTime = playerRef.current.getCurrentTime();
      setPausedTime(currentPausedTime);
      playerRef.current.pauseVideo();
      setCurrentAction("pause");
<<<<<<< HEAD
      updateSettings({ paused_time: currentPausedTime, action: "pause" });
=======
>>>>>>> 5c11e67 (changes)
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 4,
        borderRadius: "16px",
        boxShadow: 3,
        backgroundColor: "#FAFAFA",
      }}
    >
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
        YouTube Video Admin
      </Typography>

      <Card elevation={2} sx={{ borderRadius: "12px", boxShadow: 1 }}>
        <CardContent>
          {/* Video Controls */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="YouTube Video URL"
                  variant="outlined"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  label="Start Time (Min)"
                  type="number"
                  inputProps={{ step: 0.1 }}
                  value={(startTime / 60).toFixed(1)}
                  onChange={(e) => setStartTime(parseFloat(e.target.value) * 60)}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  label="End Time (Min)"
                  type="number"
                  inputProps={{ step: 0.1 }}
                  value={(endTime / 60).toFixed(1)}
                  onChange={(e) => setEndTime(parseFloat(e.target.value) * 60)}
                />
              </Grid>
            </Grid>
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSet}
              >
                Set Video
              </Button>
            </Box>
          </Box>

          {/* YouTube Player */}
          <Box mt={4} mb={2} textAlign="center">
            <YouTube
              videoId={videoId}
              onReady={(event: YouTubeEvent) => (playerRef.current = event.target)}
              opts={{ playerVars: { autoplay: 0 } }}
            />
          </Box>

          {/* Control Buttons */}
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrowIcon />}
              onClick={handlePlay}
            >
              Play
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<PauseIcon />}
              onClick={handlePause}
            >
              Pause
            </Button>
          </Box>

          {/* Status */}
          <Typography
            textAlign="center"
            mt={3}
            color={currentAction === "play" ? "green" : "red"}
          >
            Status: {currentAction === "play" ? "Playing" : "Paused"}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default YoutubeAdmin;
