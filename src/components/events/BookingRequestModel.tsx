import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

interface Notification {
  id: string;
  message: string;
}

interface BookingRequestsModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  notifications: Notification[];
  handleBookingAction: (bookingId: string, newStatus: string) => void;
}

const BookingRequestsModal: React.FC<BookingRequestsModalProps> = ({
  open,
  onClose,
  loading,
  notifications,
  handleBookingAction,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Booking Requests</DialogTitle>
      <DialogContent>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box key={notification.id || Math.random()} mb={2}>
              <Typography>{notification.message}</Typography>
              <Box display="flex" gap={2} mt={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => notification.id && handleBookingAction(notification.id, "Accepted")}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => notification.id && handleBookingAction(notification.id, "Declined")}
                >
                  Decline
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No notifications available</Typography>
        )}
        {loading && <CircularProgress />}
      </DialogContent>
    </Dialog>
  );
};

export default BookingRequestsModal;
