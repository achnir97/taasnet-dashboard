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
        <li><Link to="/taascard-management">TaasCard Management</Link></li>
        <li><Link to="/schedule-management">Schedule Management</Link></li>
        <li><Link to="/chip-management">Chip Management</Link></li>
        <li><Link to="/reviews-ratings">Reviews & Ratings</Link></li>
        <li><Link to="/service-platform">Service Platform</Link></li>
        <li><Link to="/broadcast">LiveStream Broadcast</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
