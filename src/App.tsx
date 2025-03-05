import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import CallbackScreen from './CallbackScreen';

const App: React.FC = () => {
  return (
    <Router basename="/line-auth">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/callback" element={<CallbackScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
