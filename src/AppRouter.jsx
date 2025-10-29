import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './page/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userId" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/user/18" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
