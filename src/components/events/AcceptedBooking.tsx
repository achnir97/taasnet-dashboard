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
  Tooltip,
  Alert,
  IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

// Booking Interface
interface Booking {
  id: string;
  eventId: string;
  booked_by: string;
  status: string;
  title: string;
}

// Backend URL
const backendUrl = process.env.REACT_APP_API_URL;

const AcceptedBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userId } = useGlobalContext();

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId) throw new Error("User ID is missing. Please log in.");

        const response = await fetch(`${backendUrl}?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to retrieve bookings.");

        const responseData = await response.json();
        const acceptedBookings = responseData.bookings?.filter(
          (booking: Booking) => booking.status.toLowerCase() === "accepted"
        );

        setBookings(acceptedBookings || []);
      } catch (err: any) {
        console.error("Error fetching accepted bookings:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedBookings();
  }, [userId]);

  const handleViewDetails = (booking: Booking) => {
    navigate(`/booking-details/${booking.id}`, { state: { booking } });
  };

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
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight="600"
        textAlign="center"
        mb={3}
        sx={{ color: "#4c4c4c" }}
      >
        Accepted Bookings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Error State */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem
              key={booking.id}
              sx={{
                mb: 2,
                borderRadius: "12px",
                padding: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleViewDetails(booking)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#6c757d" }}>
                  <EventIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="600" sx={{ color: "#333333" }}>
                    {booking.title}
                  </Typography>
                }
                secondary={
                  <Box display="flex" flexWrap="wrap" alignItems="center" color="text.secondary">
                    <PersonIcon fontSize="small" sx={{ mr: 0.5, color: "#757575" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        mr: 2,
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      Booked By: {booking.booked_by}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.9rem", color: "#666" }}>
                      Event ID: {booking.eventId}
                    </Typography>
                  </Box>
                }
              />
              <Tooltip title="View Details">
                <IconButton color="primary" sx={{ color: "#6c757d" }}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

const EmptyState: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    sx={{ color: "#6c757d" }}
  >
    <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 1 }} />
    <Typography variant="body1" fontWeight="500">
      No accepted bookings are available at the moment.
    </Typography>
  </Box>
);

export default AcceptedBookingsPage;
