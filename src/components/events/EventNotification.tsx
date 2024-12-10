import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Box,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Alert,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";

// Define the Notification type for strong typing
interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  timestamp: Date;
}

// Reusable Notification Item Component
const NotificationItem: React.FC<{ notification: Notification }> = React.memo(
  ({ notification }) => {
    const getIcon = () => {
      switch (notification.type) {
        case "info":
          return <InfoIcon color="info" />;
        case "success":
          return <NotificationsActiveIcon color="success" />;
        case "error":
          return <ErrorIcon color="error" />;
        default:
          return <InfoIcon />;
      }
    };

    return (
      <React.Fragment>
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: "transparent" }}>{getIcon()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="body1" fontWeight="bold">
                {notification.message}
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary">
                {notification.timestamp.toLocaleString()}
              </Typography>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  }
);

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchNotifications = () => {
      const user = auth.currentUser;

      if (user) {
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("userId", "==", user.uid));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date(),
            })) as Notification[];
            setNotifications(data);
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching notifications:", err);
            setError("Failed to load notifications. Please try again later.");
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
        setError("User not authenticated.");
      }
    };

    fetchNotifications();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth, db]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        maxWidth: 800,
        margin: "auto",
        marginTop: 4,
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#FDFDFD",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary"
      >
        Notifications
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* No Notifications */}
      {!loading && !error && notifications.length === 0 && (
        <Typography variant="body1" textAlign="center" color="text.secondary">
          No notifications available.
        </Typography>
      )}

      {/* Notifications List */}
      <List>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Paper>
  );
};

export default NotificationsPage;
