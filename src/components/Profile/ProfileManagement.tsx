import React from 'react';
import './ProfileManagement.css';
import profileImage from '../assets/Profile_jhon.png'; 
import portfolioImage from '../assets/portfolio.png';
import clientImage2 from '../assets/client.png';
export const ProfileManagement: React.FC = () => {
  return (
    <div className="section profile-container">
      <div className="left-column">
        {/* Talent Profile Information */}
        <div className="profile-rating">
          <p>Rating: 4.8/5.0</p>
        </div>
        <div className="profile-info">
          <img src={profileImage} alt="Talent" className="profile-img" />
          <div>
            <h3>John Doe</h3>
            <p><i className="fas fa-map-marker-alt"></i> New York, USA</p>
            <p>Skills: Web Development, Graphic Design</p>
            <p>Orders Completed: 250+</p>
          </div>
        </div>
        <div className="profile-description">
          <h4>About</h4>
          <p>I am a dedicated software engineer with expertise in full-stack development...</p>
        </div>
        <div className="expertise-level">
          <h4>Expertise Level: Level 2</h4>
        </div>
        <div className="specific-skills">
          <h4>Specific Skill Sets</h4>
          <p>React, Node.js, Figma, AWS, Docker</p>
        </div>
        <div className="portfolio">
          <h4>My Portfolio</h4>
          <div className="portfolio-thumbnails">
            <img src={portfolioImage} alt="Work 1" />
            <img src={portfolioImage} alt="Work 2" />
            <img src={portfolioImage} alt="Work 3" />
          </div>
        </div>
        <div className="reviews-rating">
          <h4>Reviews & Ratings</h4>
          <p>4.8/5.0 based on 200+ reviews</p>
        </div>
        <div className="review-card">
          <img src={clientImage2} alt="Client 2" className="client-img" />
          <div className="review-content">
            <p><strong>Michael B.</strong></p>
            <p className="review-rating">Rating: 4.7</p>
            <p>John is a highly talented developer who communicates well and delivers on time. Would highly recommend!</p>
          </div>
        </div>
        <div className="review-card">
          <img src={clientImage2} alt="Client 2" className="client-img" />
          <div className="review-content">
            <p><strong>Michael B.</strong></p>
            <p className="review-rating">Rating: 4.7</p>
            <p>John is a highly talented developer who communicates well and delivers on time. Would highly recommend!</p>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="right-column pricing-section">
        <h4>Service Pricing</h4>
        <div className="pricing-option">
          <h5>Basic</h5>
          <p>Price: $50</p>
          <p>Includes basic support and service.</p>
        </div>
        <div className="pricing-option">
          <h5>Standard</h5>
          <p>Price: $100</p>
          <p>Includes all features in Basic plus more options.</p>
        </div>
        <div className="pricing-option">
          <h5>Premium</h5>
          <p>Price: $150</p>
          <p>Includes all features in Standard plus premium support.</p>
        </div>
      </div>
    </div>
  );
};
