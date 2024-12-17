import React, { useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Snackbar,
  Paper,
  Divider,
  Box,
  TextField,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGlobalContext } from "../context/GlobalContext";
import CustomSelect from "./CustomSelect";
import { categories, eventTypes } from "./EventConstant";

const backendUrl=process.env.REACT_APP_BACKEND_URL;

const AddEvent: React.FC = () => {
  const { userId } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateFields = () => {
    return title && description && category && eventType && price && eventDate && eventTime && videoUrl;
  };

  const handleReview = () => {
    if (!validateFields()) {
      showSnackbarMessage("Please fill all required fields.");
      return;
    }
    setIsReviewing(true);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      showSnackbarMessage("Please fill all required fields.");
      return;
    }

    try {
      const eventData = {
        userId,
        title,
        description,
        category,
        eventType,
        price,
        eventDate: eventDate?.toISOString(),
        eventTime: eventTime?.toISOString(),
        videoUrl,
      };

      const response = await fetch(`${backendUrl}/api/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to save event.");

      showSnackbarMessage("Event created successfully!");
      resetForm();
      setIsReviewing(false);
    } catch (error) {
      console.error("Error during event creation:", error);
      showSnackbarMessage("Failed to save event. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setEventType("");
    setPrice("");
    setEventDate(null);
    setEventTime(null);
    setVideoUrl("");
    setImage(null);
    setPreviewImage(null);
  };

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          margin: "20px auto",
          maxWidth: 800,
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
          {isReviewing ? "Review Card Details" : "Create New Card"}
        </Typography>

        {!isReviewing ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                options={categories}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Card Type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as string)}
                options={eventTypes}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Date"
                value={eventDate}
                onChange={(newValue) => setEventDate(newValue)}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label="Time"
                value={eventTime}
                onChange={(newValue) => setEventTime(newValue)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<AddAPhotoIcon />}>
                {previewImage ? "Change Thumbnail" : "Upload Thumbnail"}
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                onClick={handleReview}
                variant="contained"
                sx={{ width: "200px", padding: "10px" }}
              >
                Review Details
              </Button>
            </Grid>
          </Grid>
        ) : (
          <>
            <Divider sx={{ mb: 2 }} />
            <Box>
              <Typography>User ID: {userId}</Typography>
              <Typography>Title: {title}</Typography>
              <Typography>Description: {description}</Typography>
              <Typography>Category: {category}</Typography>
              <Typography>Card Type: {eventType}</Typography>
              <Typography>Price: ${price}</Typography>
              <Typography>Date: {eventDate?.toDateString()}</Typography>
              <Typography>Time: {eventTime?.toLocaleTimeString()}</Typography>
              <Typography>Video URL: {videoUrl}</Typography>
            </Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                  Submit Card
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => setIsReviewing(false)} color="secondary">
                  Edit Details
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      <Snackbar
        open={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={4000}
      />
    </LocalizationProvider>
  );
};

export default AddEvent;
