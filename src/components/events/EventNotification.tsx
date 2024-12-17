import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
    Button,
    Badge,
    Paper,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    useTheme
} from "@mui/material";
import { useGlobalContext } from "../context/GlobalContext";

interface Notification {
    id: string;
    message: string;
    eventId: string;
    status: string;
    bookedBy: string;
}
const backendUrl=process.env.REACT_APP_BACKEND_URL

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
      const cache = useRef<Record<string, Notification[]>>({});
    const { userId } = useGlobalContext();
      const theme = useTheme();

        const showSnackbar = (message: string) => {
        setApiError(message);
        setSnackbarOpen(true);
    };

    const handleApiError = (error: any) => {
        console.error("API Error:", error);
        showSnackbar(error.message || "An unexpected error occurred")
    };

    useEffect(() => {
         let isMounted = true;
        if (!userId) return;
        const eventSource = new EventSource(`${backendUrl}/api/notifications?user_id=${userId}`);

        eventSource.onmessage = (event) => {
             if(isMounted) {
            const newNotification = JSON.parse(event.data) as Notification;
            setNotifications((prev) => {
                  if (cache.current[userId]) {
                   cache.current[userId] = [...prev, newNotification]
                  }
                const alreadyExists = prev.find((n) => n.id === newNotification.id);
                  if (!alreadyExists) {
                    setNotificationCount((prevCount) => prevCount + 1);
                    return [...prev, newNotification];
                }
                return prev
            });
             }
        };


        eventSource.onerror = (err) => {
            console.error("Error with SSE connection:", err);
            setError("Error fetching real-time notifications.");
             showSnackbar(`Error with SSE connection: ${err}`)
            eventSource.close();
        };

        return () => {
             isMounted = false;
            eventSource.close();
        };
    }, [userId, showSnackbar]);


    const updateBookingStatus = useCallback(async (bookingId: string, newStatus: string) => {
            setLoading(true)
        try {
            const response = await fetch(
                `${backendUrl}/api/handle-bookingStatus?user_id=${userId}&bookingId=${bookingId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to update booking status: ${response.status} ${response.statusText}`);
             }


                setNotifications((prev) => {
                    if(userId) {
                       if (cache.current[userId]) {
                         cache.current[userId] =  prev.filter((notification) => notification.id !== bookingId)
                     }
                }
                    return prev.filter((notification) => notification.id !== bookingId)
            }
             );
            setNotificationCount((prev) => prev - 1);
              showSnackbar("Booking status updated");
        } catch (err: any) {
             handleApiError(err)
        } finally {
            setLoading(false);
        }
    },[userId, showSnackbar, handleApiError])



    return (
        <Paper
            elevation={3}
            sx={{
                padding: 4,
                margin: "40px auto",
                maxWidth: 800,
                borderRadius: "12px",
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Notifications
                </Typography>
                <Badge badgeContent={notificationCount} color="error">
                    <Typography>Pending</Typography>
                </Badge>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* No Notifications */}
            {notifications.length === 0 && (
                <Typography textAlign="center" color="text.secondary">
                    No pending booking requests at the moment.
                </Typography>
            )}

            {/* Notifications List */}
            <List>
                {notifications.map((notification) => (
                    <Box
                        key={notification.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            padding: 2,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                             backgroundColor: theme.palette.background.default,
                        }}
                    >
                        <ListItemText
                            primary={<Typography fontWeight="bold">{notification.message}</Typography>}
                            secondary={
                                <Typography color="text.secondary">
                                    Booked By: {notification.bookedBy} | Event ID: {notification.eventId}
                                </Typography>
                            }
                        />
                        <Box>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => updateBookingStatus(notification.id, "Accepted")}
                                sx={{ mr: 1 }}
                                disabled={loading}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => updateBookingStatus(notification.id, "Declined")}
                                disabled={loading}
                            >
                                Decline
                            </Button>
                        </Box>
                    </Box>
                ))}
            </List>
             {loading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <CircularProgress />
                </Box>}
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

export default NotificationsPage;