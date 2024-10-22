import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { ProfileManagement } from './components/Profile/ProfileManagement';
import Footer, {  } from './components/Footer/Footer';
import { FirebaseError } from 'firebase/app';
import firebaseApp from './firebase'; 
import AgoraVideo from './components/Agora/AgoraVideo';
import MainRoutes from './MainRoutes';

const App: React.FC = () => {
  useEffect(() => {
    // Firebase initialization is logged in the console from firebase.ts
    console.log('Firebase App Instance:', firebaseApp);
  }, [])
  return (

  

    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="main-content">
        <ProfileManagement />
        {/* <TaasCardManagement />
        <ScheduleManagement />
        <ChipManagement />
        <Notifications />
        <UserFeedback />
        <ServicePlatform /> */}
      </div>
     {/* Main content with routes */}
      <Footer />
    </div>
  );
};

export default App;
