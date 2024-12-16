import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Navbar/Navbar";
import { ProfileManagement } from "./components/Profile/ProfileManagement";
import Footer from "./components/Footer/Footer";
import AgoraVideo from "./components/Agora/AgoraVideo";
//import YoutubeAdmin from "./components/Youtube/Youtube";
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
import BookingDetailsPage from "./components/events/BookingDetailsPage";
import Navbar from "./components/Navbar/Navbar";
const App: React.FC = () => {

  const VideoCallRoute: React.FC = () => {
    const location = useLocation();
    const title = location.state?.title || "Video Call";
  
    return <VideoCallPage title={title} />;
  };
  return (
    <GlobalProvider>
    
      <div className="grid-container">
        
        <div className="main-content">
        <Header />
        <Navbar />

          <Routes>
          <Route path="/login" element={<AuthPage />} />
             
            <Route 
            path="/home" 
            element={
                    <ProtectedRoute>
                      <ProfileManagement/>  
                    </ProtectedRoute>} />
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
            {/* <Route
              path="/service-platform"
              element={
                <ProtectedRoute>
                   <YoutubeAdmin /> 
                </ProtectedRoute>
              }
            /> */}
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
            <Route 
            path="/video-call" 
            element={ 
            <ProtectedRoute> 
              <VideoCallRoute />
              </ProtectedRoute>} />
            <Route
              path="/event-details/:eventId"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />

          <Route
              path="/booking-details/:eventId"
              element={
                <ProtectedRoute>
                  <BookingDetailsPage />
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
