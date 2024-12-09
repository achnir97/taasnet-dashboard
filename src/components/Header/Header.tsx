import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHeart,
  faEnvelope,
  faSearch,
  faCog,
  faBars,
  faCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import profileImage from "../assets/Profile_jhon.png";
import { db } from "../Firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import BookingRequestsModal from "../events/BookingRequestModel";


const Header: React.FC = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Online");
  const [user, setUser] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Check authentication state on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchNotifications(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);


  const fetchNotifications = async (userId: string) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const eventsRef = collection(db, "events");
  
      // Fetch organized events
      const qEvents = query(eventsRef, where("userId", "==", userId));
      const eventSnapshot = await getDocs(qEvents);
  
      const organizedEventIds: string[] = [];
      eventSnapshot.forEach((doc) => {
        organizedEventIds.push(doc.id);
      });
  
      if (organizedEventIds.length > 0) {
        // Fetch only pending bookings
        const qBookings = query(
          bookingsRef,
          where("eventId", "in", organizedEventIds),
          where("status", "==", "pending") // Only show pending bookings
        );
  
        onSnapshot(qBookings, (snapshot) => {
          const bookings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(bookings);
          setNotificationCount(bookings.length); // Update notification count
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  // Update user status
  const updateStatus = async (status: string) => {
    if (user) {
      try {
        const statusRef = doc(db, "talents", user.uid);
        await setDoc(statusRef, { status }, { merge: true });
        setSelectedStatus(status);
        setDropdownVisible(false);
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleBookingAction = async (bookingId: string, status: string) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
  
      // Fetch the booking document
      const bookingSnapshot = await getDoc(bookingRef);
      const bookingData = bookingSnapshot.data();
  
      if (!bookingData || !bookingData.bookedBy || !bookingData.eventId) {
        console.error("Booking data is incomplete or missing required fields.");
        alert("Error: Booking data is incomplete. Cannot send notification.");
        return;
      }
  
      // Update the booking status
      await updateDoc(bookingRef, { status });
  
      // Send notification only if status is accepted
      if (status === "accepted") {
        const notificationRef = collection(db, "notifications");
        await addDoc(notificationRef, {
          userId: bookingData.bookedBy,
          eventId: bookingData.eventId,
          message: `Your booking for event "${bookingData.eventId}" has been accepted.`,
          createdAt: new Date(),
          read: false,
        });
      }
  
      alert(`Request has been ${status}.`);
  
      // Update local notifications to exclude this booking
      setNotifications((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.error("Error updating booking status or sending notification:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };
  
  // Logout the user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Toggle functions
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-left">
        <h1 className="logo">TaaS.com</h1>
      </div>

      {/* Search Bar */}
      <div className="header-center">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search talent or services"
            className="search-bar"
          />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* Right Icons */}
      {user && (
        <div className="header-right">
          {/* Notifications */}
          <div className="icon-badge" onClick={toggleModal}>
            <FontAwesomeIcon
              icon={faBell}
              className="header-icon"
              title="Notifications"
            />
            {notificationCount > 0 && (
              <span className="badge">{notificationCount}</span>
            )}
          </div>
          <FontAwesomeIcon icon={faHeart} className="header-icon" title="Likes" />
          <FontAwesomeIcon
            icon={faEnvelope}
            className="header-icon"
            title="Messages"
          />

          {/* Profile Image */}
          <div className={`profile-image-container ${selectedStatus.toLowerCase()}`}>
            <img src={profileImage} alt="Profile" className="profile-image" />
          </div>

          {/* Settings Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faCog}
              className="settings-icon"
              onClick={toggleDropdown}
              title="Settings"
            />
            <div className={`dropdown-content ${dropdownVisible ? "show" : ""}`}>
              <div onClick={() => updateStatus("Online")} className="dropdown-item">
                <FontAwesomeIcon icon={faCircle} style={{ color: "green" }} /> Online
              </div>
              <div onClick={() => updateStatus("Busy")} className="dropdown-item">
                <FontAwesomeIcon icon={faCircle} style={{ color: "red" }} /> Busy
              </div>
              <div onClick={() => updateStatus("Offline")} className="dropdown-item">
                <FontAwesomeIcon icon={faCircle} style={{ color: "gray" }} /> Offline
              </div>
              <div onClick={() => updateStatus("In a Meeting")} className="dropdown-item">
                <FontAwesomeIcon icon={faCircle} style={{ color: "orange" }} /> In a Meeting
              </div>
              <hr />
              <div onClick={handleLogout} className="dropdown-item logout-item">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Requests Modal */}
      <BookingRequestsModal
        open={modalOpen}
        onClose={toggleModal}
        loading={loadingNotifications}
        notifications={notifications}
        handleBookingAction={handleBookingAction}
      />
    </header>
  );
};

export default Header;
