import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Grid,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Firebase initialization
const db = getFirestore();
const auth = getAuth();

interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
}

const UserEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const eventsData: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            userId: data.userId || "",
            title: data.title || "No Title",
            description: data.description || "No Description",
            videoUrl: data.videoUrl || "",
            imageUrl: data.imageUrl || "",
          });
        });

        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (eventId: string) => {
    navigate(`/event-details/${eventId}`); // Navigate to the details page
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        margin: "20px auto",
        maxWidth: 1200,
        borderRadius: "12px",
        backgroundColor: "#FAFAFA",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        My Events
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(event.id)} // Navigate on click
              >
                <CardMedia
                  component="iframe"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(event.videoUrl)}`}
                  title={event.title}
                  height="200"
                  style={{ borderRadius: "16px 16px 0 0" }}
                  allowFullScreen
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description.length > 60
                      ? `${event.description.substring(0, 60)}...`
                      : event.description}
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

const extractYouTubeId = (url: string): string => {
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

export default UserEventsList;
