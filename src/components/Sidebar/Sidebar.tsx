import React from 'react';
import './Sidebar.css'; // Include your sidebar styles

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Profile Management</a></li>
        <li><a href="#">TaasCard Management</a></li>
        <li><a href="#">Schedule Management</a></li>
        <li><a href="#">Chip Management</a></li>
        <li><a href="#">Reviews & Ratings</a></li>
        <li><a href="#">Service Platform</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
