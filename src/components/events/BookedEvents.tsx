import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const BookedEvents: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeenBookings = () => {
      const user = auth.currentUser;
      if (!user) return;

      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("organizerId", "==", user.uid), where("seen", "==", true));

      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
        setLoading(false);
      });
    };

    fetchSeenBookings();
  }, []);

  return (
    <Paper sx={{ maxWidth: 800, margin: "20px auto", padding: 3, borderRadius: 3 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Booked Events
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography textAlign="center">No bookings to display.</Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem key={booking.id}>
              <ListItemText
                primary={`Event: ${booking.eventTitle}`}
                secondary={`Booked By: ${booking.bookedBy} on ${new Date(
                  booking.createdAt.seconds * 1000
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default BookedEvents;
