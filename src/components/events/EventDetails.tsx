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

interface EventData {
  title: string;
  description: string;
  category: string;
  eventType: string;
  price: number;
  eventDate: any;
  eventTime: string;
  videoUrl: string;
  userId: string;
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, "events", eventId as string);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          setEvent(eventSnapshot.data() as EventData);
        } else {
          alert("Event not found!");
          navigate("/events-list");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        alert("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  // Utility to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Event delete confirmation
  const handleDelete = async () => {
    if (inputTitle.trim() !== event?.title) {
      setDeleteError("Event title does not match. Please enter the correct title.");
      return;
    }

    const user = auth.currentUser;
    if (user?.uid !== event?.userId) {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5" color="error">
          Event not found!
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: "30px auto",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Event Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        color="primary"
      >
        {event.title}
      </Typography>

      {/* Embedded Video */}
      {event.videoUrl && (
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
      )}

      {/* Event Details */}
      <Box mb={3}>
        <Typography>
          <strong>Description:</strong> {event.description}
        </Typography>
        <Typography>
          <strong>Category:</strong> {event.category}
        </Typography>
        <Typography>
          <strong>Card Type:</strong> {event.eventType}
        </Typography>
        <Typography>
          <strong>Price:</strong> ${event.price}
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {event.eventDate?.toDate ? new Date(event.eventDate.toDate()).toDateString() : "N/A"}
        </Typography>
        <Typography>
          <strong>Time:</strong> {event.eventTime}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: "8px", padding: "10px 24px" }}
          onClick={() => navigate(`/create-event?eventId=${eventId}`)}
        >
          Edit Card
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ borderRadius: "8px", padding: "10px 24px" }}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Card
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Card Deletion</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Type <strong>{event.title}</strong> to confirm deletion.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            error={Boolean(deleteError)}
            helperText={deleteError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EventDetails;
