import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Groups,
  Person,
} from "@mui/icons-material";
import {
  initAgora,
  joinChannel,
  leaveChannel,
  agoraService,
} from "./Boardcast";
import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const AgoraVideo: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localVideoElementRef = useRef<HTMLVideoElement>(null);
  const remoteVideoElementRef = useRef<HTMLVideoElement>(null);

  const showSnackbar = (message: string) => {
    setApiError(message);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        if (isMounted) {
          await initAgora(
            localVideoRef.current?.id || "local-video",
            remoteVideoRef.current?.id || "remote-container"
          );
        }
      } catch (error: any) {
        console.error("Failed to initialize Agora:", error);
        showSnackbar(`Failed to initialize Agora. ${error.message}`);
      }
    };

    init();

    return () => {
      isMounted = false;
      leaveChannel();
    };
  }, []);

  const setVideoSize = useCallback(
    (
      videoRef: React.RefObject<HTMLVideoElement>,
      containerRef: React.RefObject<HTMLDivElement>
    ) => {
      const videoElement = videoRef.current;
      const containerElement = containerRef.current;

      if (videoElement && containerElement) {
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover";
        videoElement.style.position = "absolute";
        videoElement.style.top = "0";
        videoElement.style.left = "0";
      }
    },
    []
  );

  const handleJoinChannel = useCallback(
    async (isHost: boolean) => {
      setLoading(true);
      setApiError(null);
      try {
        await joinChannel(isHost, localVideoRef.current?.id || "local-video");
        setIsStreaming(true);
        if (isHost) {
          setVideoSize(localVideoElementRef, localVideoRef);
        } else {
          setVideoSize(remoteVideoElementRef, remoteVideoRef);
        }
      } catch (error: any) {
        console.error("Failed to join channel:", error);
        showSnackbar(`Failed to join channel: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [showSnackbar, setVideoSize]
  );

  const handleLeaveCall = useCallback(async () => {
    setApiError(null);
    try {
      if (agoraService.localAudioTrack) {
        await agoraService.localAudioTrack.stop();
        await agoraService.localAudioTrack.close();
      }
      if (agoraService.localVideoTrack) {
        await agoraService.localVideoTrack.stop();
        await agoraService.localVideoTrack.close();
      }
      await leaveChannel();
      setIsStreaming(false);
      setIsMuted(false);
      setIsVideoOff(false);
    } catch (error: any) {
      console.error("Failed to leave channel:", error);
      showSnackbar(`Failed to leave channel: ${error.message}`);
    }
  }, [showSnackbar]);

  const toggleMute = useCallback(async () => {
    try {
      const muteStatus = !isMuted;
      setIsMuted(muteStatus);
      if (agoraService.localAudioTrack) {
        await agoraService.localAudioTrack.setEnabled(!muteStatus);
      }
    } catch (error: any) {
      console.error("Failed to toggle mute:", error);
      showSnackbar(`Failed to toggle mute: ${error.message}`);
    }
  }, [isMuted, showSnackbar]);

  const toggleVideo = useCallback(async () => {
    try {
      const videoStatus = !isVideoOff;
      setIsVideoOff(videoStatus);
      if (agoraService.localVideoTrack) {
        await agoraService.localVideoTrack.setEnabled(!videoStatus);
      }
    } catch (error: any) {
      console.error("Failed to toggle video:", error);
      showSnackbar(`Failed to toggle video: ${error.message}`);
    }
  }, [isVideoOff, showSnackbar]);

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: "1200px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Live Call
      </Typography>

      {/* Video Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmallScreen ? "1fr" : "1fr 1fr",
          gap: 2,
          width: "100%",
          height: isStreaming ? "60vh" : "40vh",
          position: "relative",
        }}
      >
        {isStreaming ? (
          <>
            <Box
              id="local-video"
              ref={localVideoRef}
              sx={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: theme.palette.grey[900],
              }}
            >
              <video ref={localVideoElementRef}></video>
            </Box>
            <Box
              id="remote-container"
              ref={remoteVideoRef}
              sx={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: theme.palette.grey[900],
              }}
            >
              <video ref={remoteVideoElementRef}></video>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                border: `1px dashed ${theme.palette.grey[400]}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Groups
                fontSize="large"
                sx={{ color: theme.palette.text.disabled, mb: 1 }}
              />
              <Typography variant="body1" color="text.disabled">
                Join the call to start streaming
              </Typography>
            </Box>
            <Box
              sx={{
                border: `1px dashed ${theme.palette.grey[400]}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Person
                fontSize="large"
                sx={{ color: theme.palette.text.disabled, mb: 1 }}
              />
              <Typography variant="body1" color="text.disabled">
                Other participants will appear here
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Button Groups */}
      {!isStreaming && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton
            onClick={() => handleJoinChannel(true)}
            disabled={loading}
            title="Join as Host"
            aria-label="Join as Host"
            sx={{
              backgroundColor: theme.palette.action.hover,
              "&:hover": { backgroundColor: theme.palette.action.focus },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Person fontSize="large" />
            )}
          </IconButton>
          <IconButton
            onClick={() => handleJoinChannel(false)}
            disabled={loading}
            title="Join as Audience"
            aria-label="Join as Audience"
            sx={{
              backgroundColor: theme.palette.action.hover,
              "&:hover": { backgroundColor: theme.palette.action.focus },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Groups fontSize="large" />
            )}
          </IconButton>
        </Box>
      )}

      {isStreaming && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton onClick={toggleMute} title="Toggle Mic" aria-label="Toggle Mic">
            {isMuted ? <MicOff /> : <Mic />}
          </IconButton>
          <IconButton onClick={toggleVideo} title="Toggle Video" aria-label="Toggle Video">
            {isVideoOff ? <VideocamOff /> : <Videocam />}
          </IconButton>
          <IconButton
            onClick={handleLeaveCall}
            title="Leave Call"
            aria-label="Leave Call"
            sx={{
              backgroundColor: theme.palette.error.main,
              color: theme.palette.getContrastText(theme.palette.error.main),
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            <CallEnd />
          </IconButton>
        </Box>
      )}

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
          {apiError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgoraVideo;
