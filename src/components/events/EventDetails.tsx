import React, { useEffect, useState, useCallback } from "react";
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
    IconButton,
    useTheme,
    useMediaQuery,
    Alert,
    Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";


const BACKEND_API_URL = process.env.REACT_APP_API_URL;

interface EventData {
    ID: string;
    Title: string;
    Description: string;
    Category: string;
    EventType: string;
    Price: number;
    EventDate: string;
    EventTime: string;
    VideoUrl: string;
    UserID: string;
}

const EventDetails: React.FC = () => {
    const { eventId } = useParams();
    const { userId } = useGlobalContext();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [inputTitle, setInputTitle] = useState<string>("");
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Error snackbar helper
    const showSnackbar = (message: string) => {
        setApiError(message);
        setSnackbarOpen(true);
    };


    // Function to fetch event data
    const fetchEvent = useCallback(async () => {
        setLoading(true);
        setApiError(null); // Reset any prior errors
        try {
            if (!userId || !eventId) {
                showSnackbar("Invalid request. User ID or Event ID is missing.");
                navigate("/events-list");
                return;
            }

            const response = await fetch(
                `${BACKEND_API_URL}/api/cards/event-id?user_id=${userId}&id=${eventId}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch event details: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
                setEvent(data.cards[0]);
            } else {
                throw new Error("Event not found.");
            }
        } catch (error: any) {
            console.error("Error fetching event:", error);
            showSnackbar(`Failed to load event details. ${error.message}`);
            navigate("/events-list");
        } finally {
            setLoading(false);
        }
    }, [eventId, userId, navigate]);

    // Fetch event data on mount and when eventId or userId changes
    useEffect(() => {
        fetchEvent();
    }, [eventId, userId, fetchEvent]);


    // Function to extract YouTube video ID
    const extractYouTubeId = (url: string): string | null => {
        const regExp =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    // Function to handle event deletion
    const handleDelete = async () => {
        if (inputTitle.trim() !== event?.Title) {
            setDeleteError("Event title does not match. Please enter the correct title.");
            return;
        }

        setDeleteError(null); // Clear previous errors
        try {
            const response = await fetch(
                `${BACKEND_API_URL}/api/cards?user_id=${userId}&id=${eventId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete the event: ${response.status} ${response.statusText}`);
            }
            showSnackbar("Event deleted successfully.");
            navigate("/events-list");
        } catch (error: any) {
            console.error("Error deleting event:", error);
            setDeleteError("Failed to delete the event. Please try again later.");
            showSnackbar(`Failed to delete event. ${error.message}`);
        }
    };

    // Loading state component
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
            </Box>
        );
    }

    // No event found component
    if (!event) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="h5" color="error">
                    Event not found!
                </Typography>
            </Box>
        );
    }
    // Component to display the video
    const VideoEmbed = () => {
        if (!event.VideoUrl) return null;

        const videoId = extractYouTubeId(event.VideoUrl);
        if (!videoId) return null;

        return (
            <Box
                mb={4}
                sx={{
                    position: "relative",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: theme.shadows[3],
                }}
            >
                <iframe
                    title="Event Video"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                    }}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allowFullScreen
                />
            </Box>
        );
    };

    // Displaying the event details
    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: isSmallScreen ? "95%" : 800,
                margin: "30px auto",
                padding: theme.spacing(isSmallScreen ? 2 : 4),
                borderRadius: "12px",
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
            }}
        >

            {/* Back Button */}
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: theme.palette.text.secondary }}>
                    <ArrowBackIcon fontSize="medium" />
                </IconButton>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                    Back to Events
                </Typography>
            </Box>

            {/* Event Title */}
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} color={theme.palette.text.primary}>
                {event.Title}
            </Typography>


            {/* Embedded Video */}
            <VideoEmbed />

            {/* Event Details */}
            <Box mb={4} color={theme.palette.text.secondary}>
                <Typography><strong>Description:</strong> {event.Description}</Typography>
                <Typography><strong>Category:</strong> {event.Category}</Typography>
                <Typography><strong>Event Type:</strong> {event.EventType}</Typography>
                <Typography><strong>Price:</strong> ${event.Price}</Typography>
                <Typography><strong>Date:</strong> {new Date(event.EventDate).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {event.EventTime}</Typography>
            </Box>

            {/* Actions */}
            <Box display="flex" justifyContent="center" gap={2}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.grey[600],
                        color: theme.palette.common.white,
                        "&:hover": { backgroundColor: theme.palette.grey[700] },
                        borderRadius: "8px",
                    }}
                    onClick={() => navigate(`/create-event?eventId=${eventId}`)}
                >
                    Edit Event
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        "&:hover": { backgroundColor: theme.palette.error.light, borderColor: theme.palette.error.dark },
                        borderRadius: "8px",
                    }}
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    Delete Event
                </Button>
            </Box>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Type <strong>{event.Title}</strong> to confirm deletion.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        error={!!deleteError}
                        helperText={deleteError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        sx={{ borderRadius: "8px" }}
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {apiError}
                </Alert>
            </Snackbar>


        </Paper>
    );
};

export default EventDetails;