// Sidebar.tsx
import React from 'react';
import './Sidebar.css'; // Include your sidebar styles
import { Link } from 'react-router-dom'; // Import Link for navigation

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile-management">Profile Management</Link></li>
        <li><Link to="/events-list">Services</Link></li>
        <li><Link to="/bookings">Requests</Link></li>
        <li><Link to="/create-event">Create Event</Link></li>
        <li><Link to="/service-platform">Service Platform</Link></li>
        <li><Link to="/broadcast">LiveStream Broadcast</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;