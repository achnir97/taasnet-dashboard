// MainRoutes.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
//import AgoraVideo from '../components/Agora/AgoraVideo';
import AgoraVideo from './components/Agora/AgoraVideo';

const MainRoutes: React.FC = () => {
  let routes = useRoutes([
    { path: '/broadcast', element: <AgoraVideo /> },
  ]);
  return routes;
};

export default MainRoutes;
