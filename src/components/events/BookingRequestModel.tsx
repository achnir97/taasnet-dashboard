import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

interface BookingRequestsModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  notifications: any[];
  handleBookingAction: (bookingId: string, status: string) => void;
}

const BookingRequestsModal: React.FC<BookingRequestsModalProps> = ({
  open,
  onClose,
  loading,
  notifications,
  handleBookingAction,
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="booking-requests-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "24px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          id="booking-requests-modal"
          variant="h5"
          fontWeight={700}
          mb={2}
          textAlign="center"
        >
          Booking Requests
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No new booking requests at the moment.
          </Typography>
        ) : (
          notifications.map((booking) => (
            <Box
              key={booking.id}
              sx={{
                backgroundColor: "#f9f9f9",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                mb: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Event: {booking.eventTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requested by: <strong>{booking.userName}</strong>
              </Typography>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleBookingAction(booking.id, "accepted")}
                  sx={{
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#2e7d32" },
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleBookingAction(booking.id, "declined")}
                  sx={{
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                >
                  Decline
                </Button>
              </Box>
            </Box>
          ))
        )}
        <Button
          variant="outlined"
          fullWidth
          onClick={onClose}
          sx={{
            mt: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default BookingRequestsModal;
