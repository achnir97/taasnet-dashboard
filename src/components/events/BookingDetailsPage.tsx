import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    Avatar,
    Card,
    CardContent,
    CardActions,
    Chip,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";

interface Booking {
    id: string;
    eventId: string;
    bookedBy: string;
    status: string;
    title: string;
    description?: string;
}

const BookingDetailsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


    const booking: Booking = location.state?.booking;

    if (!booking) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
                textAlign="center"
            >
                <Typography variant="h6" color="error">
                    No booking data available. Please go back to the bookings page.
                </Typography>
            </Box>
        );
    }

    const handleStartCall = () => {
        navigate("/video-call", { state: { booking } });
    };

    return (
        <Paper
            elevation={4}
            sx={{
                margin: "40px auto",
                maxWidth: isSmallScreen ? "95%" : 700,
                padding: theme.spacing(3),
                borderRadius: "16px",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[3],
                 transition: "box-shadow 0.3s ease",
            }}
        >
             {/* Back Button */}
            <Box display="flex" alignItems="center" mb={2}>
                 <IconButton onClick={() => navigate(-1)} sx={{ color: theme.palette.text.secondary }}>
                    <ArrowBackIcon fontSize="medium" />
                </IconButton>
                 <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                    Back to Bookings
                </Typography>
             </Box>

            {/* Title */}
            <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                mb={3}
                color="primary"
                sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, color: theme.palette.text.primary }}
            >
                Booking Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Booking Information */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: "12px",
                    mb: 3,
                    backgroundColor: theme.palette.background.default,
                    boxShadow: theme.shadows[1],
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[3] },
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: theme.palette.grey[600], width: 56, height: 56 }}>
                            <EventIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="600" color={theme.palette.text.primary}>
                                {booking.title}
                            </Typography>
                            <Chip
                                label={booking.status}
                                sx={{
                                    backgroundColor:
                                        booking.status.toLowerCase() === "accepted"
                                            ? theme.palette.success.light
                                            : theme.palette.error.light,
                                    color:
                                        booking.status.toLowerCase() === "accepted"
                                            ? theme.palette.success.dark
                                            : theme.palette.error.dark,
                                    fontWeight: "500",
                                }}
                                size="small"
                            />
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                         <PersonIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.disabled }} />
                       <strong>Booked By:</strong> {booking.bookedBy}
                   </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                      <strong>Event ID:</strong> {booking.eventId}
                   </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                         <strong>Booking ID:</strong> {booking.id}
                  </Typography>
                    {booking.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={2}
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <DescriptionIcon fontSize="small" sx={{ color: theme.palette.text.disabled }} />
                            <strong>Description:</strong> {booking.description}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <CardActions sx={{ justifyContent: "center", gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleStartCall}
                     sx={{
                        textTransform: "none",
                         backgroundColor: theme.palette.success.main,
                        color: theme.palette.common.white,
                        "&:hover": { backgroundColor: theme.palette.success.dark },
                        borderRadius: "8px",
                    }}
                >
                    Start Call
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => alert("Cancelling booking...")}
                    sx={{
                        textTransform: "none",
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                         "&:hover": {
                            backgroundColor: theme.palette.error.light,
                            borderColor: theme.palette.error.dark,
                        },
                        borderRadius: "8px",
                    }}
                >
                    Cancel Booking
                </Button>
            </CardActions>
        </Paper>
    );
};

export default BookingDetailsPage;