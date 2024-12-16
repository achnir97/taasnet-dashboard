import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Strong typing for bookings
interface Booking {
  id: string;
  title: string; // Updated to use 'title'
  bookedBy: string;
  createdAt: { seconds: number; nanoseconds: number };
}

const BookedEvents: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchSeenBookings = () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("organizerId", "==", user.uid), where("seen", "==", true));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              ...(doc.data() as Booking),
            }));
            setBookings(data);
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching bookings:", err);
            setError("Failed to load bookings. Please try again.");
            setLoading(false);
          }
        );
      } catch (e) {
        console.error("Unexpected error:", e);
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchSeenBookings();

    return () => {
      if (unsubscribe) unsubscribe(); // Clean up the listener
    };
  }, [auth, db]);

  return (
    <Paper
         elevation={2}
         sx={{
           padding: 4,
           margin: "20px auto",
           maxWidth: 1200,
           borderRadius: "12px",
           backgroundColor: "#f8f9fa", // Neutral background
           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
         }}
      >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} color="primary">
        Booked Events
      </Typography>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="primary" />
        </Box>
      ) : bookings.length === 0 ? (
        // Empty State
        <Typography variant="body1" textAlign="center" color="text.secondary">
          No bookings to display.
        </Typography>
      ) : (
        // Bookings List
        <List>
          {bookings.map((booking) => (
            <React.Fragment key={booking.id}>
              <BookedEventItem booking={booking} />
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

// Reusable list item for a booking
const BookedEventItem: React.FC<{ booking: Booking }> = React.memo(({ booking }) => {
  const formattedDate = new Date(booking.createdAt.seconds * 1000).toLocaleString();

  return (
    <ListItem sx={{ "&:hover": { backgroundColor: "#f5f5f5", borderRadius: 2 } }}>
      <ListItemAvatar>
        <Avatar sx={{ backgroundColor: "#4caf50", color: "white" }}>
          <EventIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6" fontWeight="bold">
            {booking.title} {/* Replaced 'eventTitle' with 'title' */}
          </Typography>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
              <PersonIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
              Booked By: <strong>{booking.bookedBy}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booked At: {formattedDate}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
});

export default BookedEvents;
