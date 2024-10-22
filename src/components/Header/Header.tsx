// src/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHeart, faEnvelope, faSearch, faCog, faBars, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';
import profileImage from '../assets/Profile_jhon.png';
import { db } from '../../firebase'; // Firebase import
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

const Header: React.FC = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Online'); // Default status
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle hamburger menu
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  // Toggle settings menu in mobile
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  // Toggle settings dropdown in desktop
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Close dropdown if clicked outside (desktop view)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Automatically close hamburger menu when resizing back to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setHamburgerOpen(false); // Close hamburger when screen size increases
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to update status in Firestore
  const updateStatus = async (status: string) => {
    try {
      const statusRef = doc(db, 'talents', 'talentId'); // Replace 'talentId' with actual talent ID logic
      await setDoc(statusRef, { status }, { merge: true });
      setSelectedStatus(status); // Update the selected status locally
      console.log(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    updateStatus(status);
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>Taasnet.com</h1>
      </div>

      {/* Search Bar for Desktop */}
      <div className="header-center">
        <div className="search-bar-container">
          <input type="text" placeholder="Search talent or services" className="search-bar" />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* Icons for Desktop */}
      <div className="header-right">
        <FontAwesomeIcon icon={faBell} className="header-icon" />
        <FontAwesomeIcon icon={faHeart} className="header-icon" />
        <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
        <span className="orders-text">Orders</span>
        
        {/* Profile Image with dynamic background color */}
        <div className={`profile-image-container ${selectedStatus.toLowerCase()}`}>
          <img src={profileImage} alt="Profile" className="profile-image" />
        </div>

        <div className="dropdown" ref={dropdownRef}>
          <FontAwesomeIcon icon={faCog} className="settings-icon" onClick={toggleDropdown} />
          <div id="dropdown-menu" className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
            <div className="dropdown-item" onClick={() => handleStatusChange('Online')}>
              <FontAwesomeIcon icon={faCircle} style={{ color: 'green' }} className="status-icon" />
              <span className="status-text">Online</span>
            </div>
            <div className="dropdown-item" onClick={() => handleStatusChange('Busy')}>
              <FontAwesomeIcon icon={faCircle} style={{ color: 'red' }} className="status-icon" />
              <span className="status-text">Busy</span>
            </div>
            <div className="dropdown-item" onClick={() => handleStatusChange('Offline')}>
              <FontAwesomeIcon icon={faCircle} style={{ color: 'gray' }} className="status-icon" />
              <span className="status-text">Offline</span>
            </div>
            <div className="dropdown-item" onClick={() => handleStatusChange('In a Meeting')}>
              <FontAwesomeIcon icon={faCircle} style={{ color: 'orange' }} className="status-icon" />
              <span className="status-text">In a Meeting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="hamburger" onClick={toggleHamburger}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Mobile Sidebar */}
      {hamburgerOpen && (
        <div className="mobile-sidebar">
          {/* Close button for the sidebar */}
          <div className="mobile-sidebar-close" onClick={toggleHamburger}>
            <FontAwesomeIcon icon={faTimes} />
          </div>

          <div className="mobile-profile-image">
            <img src={profileImage} alt="Profile" />
          </div>

          {/* Mobile Search Bar */}
          <div className="mobile-search-bar">
            <input type="text" placeholder="Search talent or services" className="search-bar" />
          </div>

          <ul className="mobile-menu">
            <li><a href="#">Notifications</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Likes</a></li>
            <li className="settings">
              <a href="#" onClick={toggleSettings}>
                Settings
                <span className="settings-arrow">{settingsOpen ? '▲' : '▼'}</span>
              </a>
              {settingsOpen && (
                <ul className="settings-dropdown show">
                  <li className="dropdown-item" onClick={() => handleStatusChange('Online')}>
                    <FontAwesomeIcon icon={faCircle} style={{ color: 'green' }} className="status-icon" />
                    <span className="status-text">Online</span>
                  </li>
                  <li className="dropdown-item" onClick={() => handleStatusChange('Busy')}>
                    <FontAwesomeIcon icon={faCircle} style={{ color: 'red' }} className="status-icon" />
                    <span className="status-text">Busy</span>
                  </li>
                  <li className="dropdown-item" onClick={() => handleStatusChange('Offline')}>
                    <FontAwesomeIcon icon={faCircle} style={{ color: 'gray' }} className="status-icon" />
                    <span className="status-text">Offline</span>
                  </li>
                  <li className="dropdown-item" onClick={() => handleStatusChange('In a Meeting')}>
                    <FontAwesomeIcon icon={faCircle} style={{ color: 'orange' }} className="status-icon" />
                    <span className="status-text">In a Meeting</span>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
