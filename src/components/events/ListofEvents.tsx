import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

// Backend API URL
const BACKEND_API_URL = process.env.REACT_APP_API_URL;

interface Event {
  ID: string; // Backend returns "ID"
  Title: string;
  Description: string;
  EventDate: string;
  EventTime: string;
  VideoUrl: string;
  ImageUrl?: string; // For thumbnail images
}

const UserEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_API_URL}/api/cards/user?user_id=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cards.");

        const responseData = await response.json();
        const cards = responseData?.cards;

        if (Array.isArray(cards) && cards.length > 0) {
          setEvents(cards);
        } else {
          setError("No cards available. Please create an event.");
        }
      } catch (err: any) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleCardClick = (eventId: string) => {
    navigate(`/event-details/${eventId}`);
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
      <Typography
        variant="h4"
        fontWeight={600}
        textAlign="center"
        mb={4}
        sx={{ color: "#333" }}
      >
        My Cards
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.ID}>
              <Card
                onClick={() => handleCardClick(event.ID)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {/* Media Section */}
                {event.VideoUrl ? (
                  <CardMedia
                    component="iframe"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(event.VideoUrl)}`}
                    title={event.Title}
                    sx={{
                      height: 180,
                      borderRadius: "12px 12px 0 0",
                      backgroundColor: "#e9ecef",
                    }}
                    allowFullScreen
                  />
                ) : event.ImageUrl ? (
                  <CardMedia
                    component="img"
                    image={event.ImageUrl}
                    alt={event.Title}
                    sx={{
                      height: 180,
                      borderRadius: "12px 12px 0 0",
                      objectFit: "cover",
                      backgroundColor: "#e9ecef",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e9ecef",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Media Available
                    </Typography>
                  </Box>
                )}

                {/* Content Section */}
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="#333"
                    sx={{ mb: 1, lineHeight: "1.4" }}
                  >
                    {event.Title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {event.Description?.length > 70
                      ? `${event.Description.substring(0, 70)}...`
                      : event.Description}
                  </Typography>
                  <Typography variant="body2" color="#555" fontWeight={500}>
                    Date: {new Date(event.EventDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="#555" fontWeight={500}>
                    Time: {event.EventTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

// Utility function to extract YouTube video ID
const extractYouTubeId = (url: string): string => {
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

export default UserEventsList;
