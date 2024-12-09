import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

interface Booking {
  id: string;
  eventId: string;
  userName: string;
  status: string;
}

const AcceptedBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("status", "==", "accepted"));

        const querySnapshot = await getDocs(q);
        const acceptedBookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          acceptedBookings.push({ id: doc.id, ...doc.data() } as Booking);
        });

        setBookings(acceptedBookings);
      } catch (error) {
        console.error("Error fetching accepted bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedBookings();
  }, []);

  return (
    <Paper sx={{ padding: 4, margin: "20px auto", maxWidth: 800 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
        Accepted Bookings
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <CircularProgress />
      ) : bookings.length === 0 ? (
        <Typography>No accepted bookings available.</Typography>
      ) : (
        bookings.map((booking) => (
          <Box key={booking.id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography>
              <strong>Event ID:</strong> {booking.eventId}
            </Typography>
            <Typography>
              <strong>User:</strong> {booking.userName}
            </Typography>
            <Typography>
              <strong>Status:</strong> {booking.status}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default AcceptedBookingsPage;
