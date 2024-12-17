import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import BookingRequestsModal from "../events/BookingRequestModel";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ExitToApp as LogoutIcon,
  Circle as CircleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
interface Notification {
  id: string;
  message: string;
  user_id: string;
  eventId: string;
  status: string;
  bookedBy: string;
}
const backendUrl=process.env.REACT_APP_BACKEND_URL

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const cache = useRef<Record<string, Notification[]>>({});
  const { userId, setUserId } = useGlobalContext();
  const navigate = useNavigate();

  const showSnackbar = (message: string) => {
    setApiError(message);
    setSnackbarOpen(true);
  };


  const handleStatusUpdate = (status: string) => {
    console.log(`Status updated to: ${status}`);
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setUserId(null);
    cache.current = {};
    setAnchorEl(null); // Close the menu automatically
    navigate("/login");
  };

  // SSE Listener for notifications
  useEffect(() => {
    let isMounted = true;
    if (!userId) return;

    const eventSource = new EventSource(`${backendUrl}/api/notifications?user_id=${userId}`);

    eventSource.onmessage = (event) => {
      if (!isMounted) return;

      try {
        const parsedData = JSON.parse(event.data);
        const newNotification: Notification = {
          id: parsedData.booking_id || parsedData.id,
          message: parsedData.message || "New booking request",
          user_id: parsedData.user_id || "",
          eventId: parsedData.eventId || "",
          status: parsedData.status || "pending",
          bookedBy: parsedData.bookedBy || "",
        };

        setNotifications((prev) => {
          const alreadyExists = prev.find((n) => n.id === newNotification.id);
          if (!alreadyExists) {
            setNotificationCount((prevCount) => prevCount + 1);
            const updated = [...prev, newNotification];
            cache.current[userId] = updated;
            return updated;
          }
          return prev;
        });
      } catch (err) {
        console.error("Error parsing notification data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error with SSE connection:", err);
      showSnackbar("Error fetching real-time notifications.");
      eventSource.close();
    };

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, [userId]);

  const updateBookingStatus = useCallback(
    async (bookingId: string, newStatus: string) => {
      if (!bookingId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/handle-bookingStatus?user_id=${userId}&bookingId=${bookingId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) throw new Error("Failed to update booking status.");

        setNotifications((prev) => {
          const updatedNotifications = prev.filter((n) => n.id !== bookingId);
          if (updatedNotifications.length === 0) setModalOpen(false); // Close modal if no requests
          return updatedNotifications;
        });

        setNotificationCount((prev) => Math.max(0, prev - 1));
        showSnackbar("Booking status updated successfully");
      } catch (err: any) {
        showSnackbar(err.message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return (
    <Box>
      <AppBar position="static" color="default" elevation={4}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaaS.com
          </Typography>
          <TextField
            placeholder="Search talent or services"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {userId && (
            <>
              {/* Notifications Icon */}
              <IconButton onClick={() => setModalOpen(true)}>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Avatar */}
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar src="/profile_jhon.png" />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>


      <MenuItem onClick={() => handleStatusUpdate("Online")}>
                  <CircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                  Online
                </MenuItem>
                <MenuItem onClick={() => handleStatusUpdate("Busy")}>
                  <CircleIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                  Busy
                </MenuItem>
                <MenuItem onClick={() => handleStatusUpdate("Offline")}>
                  <CircleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  Offline
                </MenuItem>
                <MenuItem onClick={() => handleStatusUpdate("In a Meeting")}>
                  <CircleIcon fontSize="small" sx={{ color: "orange", mr: 1 }} />
                  In a Meeting
                </MenuItem>
      
            <MenuItem onClick={() => handleLogout()}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />  Logout
            </MenuItem>
      </Menu>

      {/* Booking Requests Modal */}
      <BookingRequestsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        loading={loading}
        notifications={notifications}
        handleBookingAction={updateBookingStatus}
      />

      {/* Snackbar for Errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error">{apiError}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Header;
