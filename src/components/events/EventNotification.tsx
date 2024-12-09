import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Paper, Typography, List, ListItem, Divider, CircularProgress } from "@mui/material";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", user.uid));

      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotifications(data);
        setLoading(false);
      });
    }
  }, []);

  return (
    <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto", marginTop: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Notifications
      </Typography>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <CircularProgress />
      ) : notifications.length === 0 ? (
        <Typography>No notifications available.</Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem>{notification.message}</ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NotificationsPage;
