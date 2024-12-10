import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { ProfileManagement } from "./components/Profile/ProfileManagement";
import Footer from "./components/Footer/Footer";
import firebaseApp from "./components/Firebase/firebase";
import AgoraVideo from "./components/Agora/AgoraVideo";
import YoutubeAdmin from "./components/Youtube/Youtube";
import AuthPage from "./components/Authentication/Loginpage";
import { GlobalProvider } from "./components/context/GlobalContext";
import AddEvent from "./components/events/AddEvent";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import UserEventsList from "./components/events/ListofEvents";
import EventDetails from "./components/events/EventDetails";
import AcceptedBookingsPage from "./components/events/AcceptedBooking";
import { VideoCall } from "@mui/icons-material";
import VideoCallPage from "./components/events/VideoCall";
import { useLocation } from "react-router-dom";
const App: React.FC = () => {
  useEffect(() => {
    console.log("Firebase App Instance:", firebaseApp);
  }, []);
  const VideoCallRoute: React.FC = () => {
    const location = useLocation();
    const title = location.state?.title || "Video Call";
  
    return <VideoCallPage title={title} />;
  };
  return (
    <GlobalProvider>
      <div className="grid-container">
        {/* Header and Sidebar */}
        <Header />
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ProfileManagement />} />
            <Route path="/admin" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route
              path="/Profile-management"
              element={
                <ProtectedRoute>
                  <ProfileManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broadcast"
              element={
                <ProtectedRoute>
                  <AgoraVideo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service-platform"
              element={
                <ProtectedRoute>
                  <YoutubeAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events-list"
              element={
                <ProtectedRoute>
                  <UserEventsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <AcceptedBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/video-call" element={ <ProtectedRoute> <VideoCallRoute /></ProtectedRoute>} />
            <Route
              path="/event-details/:eventId"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </GlobalProvider>
  );
};

export default App;
