import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { ProfileManagement } from './components/Profile/ProfileManagement';
import Footer from './components/Footer/Footer';
import firebaseApp from './firebase'; 
import AgoraVideo from './components/Agora/AgoraVideo';
import YoutubeAdmin from './components/Youtube/Youtube';

const App: React.FC = () => {
  useEffect(() => {
    // Firebase initialization is logged in the console from firebase.ts
    console.log('Firebase App Instance:', firebaseApp);
  }, []);

  return (

      <div className="grid-container">
        <Header />
        <Sidebar />

        <div className="main-content">
          <Routes>
          <Route path="/" element={<ProfileManagement />} />
            <Route path="/Profile-management" element={<ProfileManagement />} />
            <Route path="/broadcast" element={<AgoraVideo />} />
            <Route path="/service-platform" element={<YoutubeAdmin />} />
          </Routes>
        </div>

        <Footer />
      </div>
  
  );
};

export default App;
