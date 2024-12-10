import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Chip,
  Tooltip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

interface Booking {
  id: string;
  eventId: string;
  bookedBy: string;
  bookedById: string;
  status: string;
  title: string;
}

const AcceptedBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("status", "==", "accepted"));
        const querySnapshot = await getDocs(q);

        const acceptedBookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          acceptedBookings.push({ id: doc.id, ...doc.data() } as Booking);
        });

        setBookings(acceptedBookings);
      } catch (err: any) {
        console.error("Error fetching accepted bookings:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedBookings();
  }, []);

  const handleStartCall = (booking: Booking) => {
    navigate("/video-call",  { state: { title: booking.title } });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        margin: "40px auto",
        maxWidth: 900,
        borderRadius: "12px",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3} color="primary">
        Accepted Bookings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <List>
          {bookings.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} onStartCall={handleStartCall} />
          ))}
        </List>
      )}
    </Paper>
  );
};

const BookingListItem: React.FC<{ booking: Booking; onStartCall: (booking: Booking) => void }> = ({
  booking,
  onStartCall,
}) => (
  <ListItem
    sx={{
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      mb: 2,
      backgroundColor: "#fdfdfd",
    }}
  >
    <ListItemAvatar>
      <Avatar sx={{ bgcolor: "primary.main" }}>
        <EventIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={<Typography variant="h6">{booking.title}</Typography>}
      secondary={
        <>
          <Typography variant="body2">
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            Booked By: {booking.bookedBy}
          </Typography>
          <Typography variant="body2">Event ID: {booking.eventId}</Typography>
        </>
      }
    />
    <Tooltip title="Start Video Call">
      <Button
        variant="contained"
        color="success"
        startIcon={<VideoCallIcon />}
        onClick={() => onStartCall(booking)}
      >
        Start Call
      </Button>
    </Tooltip>
  </ListItem>
);

const EmptyState: React.FC = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px">
    <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
    <Typography variant="h6" color="text.secondary">
      No accepted bookings are available at the moment.
    </Typography>
  </Box>
);

export default AcceptedBookingsPage;
