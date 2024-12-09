import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";

// Firebase initialization
const db = getFirestore();
const auth = getAuth();

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const eventRef = doc(db, "events", eventId as string);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        setEvent(eventSnapshot.data());
      } else {
        alert("Event not found!");
        navigate("/events-list");
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setInputTitle("");
    setDeleteError(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setInputTitle("");
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (inputTitle.trim() !== event.title) {
      setDeleteError("Event title does not match. Please enter the correct title.");
      return;
    }

    const user = auth.currentUser;
    if (user?.uid !== event.userId) {
      setDeleteError("You are not authorized to delete this event.");
      return;
    }

    try {
      await deleteDoc(doc(db, "events", eventId as string));
      alert("Event deleted successfully.");
      navigate("/events-list");
    } catch (error) {
      console.error("Error deleting event:", error);
      setDeleteError("Failed to delete the event. Please try again later.");
    }
  };

  const extractYouTubeId = (url: string): string => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  return loading ? (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress />
    </Box>
  ) : (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 900,
        margin: "30px auto",
        borderRadius: "16px",
        backgroundColor: "#FDFDFD",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Event Title */}
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={3}
        sx={{ color: "#333" }}
      >
        {event.title}
      </Typography>

      {/* Embedded Video */}
      <Box
        mb={4}
        sx={{
          position: "relative",
          paddingTop: "56.25%", // Responsive 16:9 Aspect Ratio
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${extractYouTubeId(event.videoUrl)}`}
          title="Event Video"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>

      {/* Event Description */}
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {event.description}
      </Typography>

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          <strong>Category:</strong> {event.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Event Type:</strong> {event.eventType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Price:</strong> ${event.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Date:</strong>{" "}
          {new Date(event.eventDate.toDate()).toDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Time:</strong> {event.eventTime}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", borderRadius: "8px", padding: "10px 20px" }}
          onClick={() => navigate(`/create-event?eventId=${eventId}`)}
        >
          Edit Event
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px 20px",
          }}
          onClick={handleOpenDeleteDialog}
        >
          Delete Event
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Event Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Please type the title <strong>{event.title}</strong> to confirm deletion.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            error={Boolean(deleteError)}
            helperText={deleteError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EventDetails;
