import React from 'react';
import './App.css';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { ProfileManagement } from './components/Profile/ProfileManagement';
import Footer, {  } from './components/Footer/Footer';

const App: React.FC = () => {
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
      <Footer />
    </div>
  );
};

export default App;
