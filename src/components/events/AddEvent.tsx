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
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useGlobalContext } from "../context/GlobalContext"; // Import Global Context
import CustomSelect from "./CustomSelect";
import { categories, eventTypes } from "./EventConstant";

// Firebase Initialization
const db = getFirestore();
const storage = getStorage();

const AddEvent: React.FC = () => {
  const { userId } = useGlobalContext(); // Access userId from GlobalContext
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [participants, setParticipants] = useState<number | "">("");
  const [videoUrl, setVideoUrl] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availableTimeInput, setAvailableTimeInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleAddAvailableTime = () => {
    if (availableTimeInput.trim()) {
      setAvailableTimes([...availableTimes, availableTimeInput.trim()]);
      setAvailableTimeInput("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateFields = () => {
    return (
      title &&
      description &&
      category &&
      eventType &&
      price &&
      eventDate &&
      eventTime &&
      videoUrl
      //image
    );
  };

  const handleReview = () => {
    if (!validateFields()) {
      showSnackbarMessage("Please fill all required fields.");
      return;
    }
    setIsReviewing(true);
  };

  const handleEdit = () => {
    setIsReviewing(false);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      showSnackbarMessage("Please fill all required fields.");
      return;
    }

    if (!userId) {
      showSnackbarMessage("User not authenticated. Please log in.");
      console.log(userId);
      return;
    }

    try {
     // const imageRef = ref(storage, `events/${Date.now()}_${image?.name}`);
     // await uploadBytes(imageRef, image as File);
     //const imageUrl = await getDownloadURL(imageRef);

      const eventId = `${userId}_${Date.now()}`;
      const eventData = {
        eventId,
        userId,
        title,
        description,
        category,
        eventType,
        price,
        eventDate: Timestamp.fromDate(eventDate as Date),
        eventTime: eventTime?.toLocaleTimeString(),
        participants,
        videoUrl,
        availableTimes,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "events"), eventData);
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
    setParticipants("");
    setVideoUrl("");
    setAvailableTimes([]);
    setAvailableTimeInput("");
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
          backgroundColor: "#FAFAFA",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {!isReviewing ? (
          <>
            <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
              Create New Card
            </Typography>
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
                  label=" Date"
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label=" Time"
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
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddAPhotoIcon />}
                >
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
            </Grid>
            <Button
              onClick={handleReview}
              variant="contained"
              fullWidth
              sx={{ mt: 3, backgroundColor: "#000", color: "#fff" }}
            >
              Review Details
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" textAlign="center" mb={2}>
              Review Your Card Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box>
            <Typography>userId: {userId}</Typography>
              <Typography>Title: {title}</Typography>
              <Typography>Description: {description}</Typography>
              <Typography>Category: {category}</Typography>
              <Typography>Card Type: {eventType}</Typography>
              <Typography>Price: ${price}</Typography>
              <Typography>Date: {eventDate?.toDateString()}</Typography>
              <Typography>Time: {eventTime?.toLocaleTimeString()}</Typography>
              <Typography>Video URL: {videoUrl}</Typography>
            </Box>
            <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 3 }}>
              Submit Card
            </Button>
            <Button onClick={handleEdit} sx={{ mt: 1 }}>
              Edit Details
            </Button>
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
