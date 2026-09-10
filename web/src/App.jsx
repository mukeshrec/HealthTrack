import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DoctorPortal } from './pages/DoctorPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="/portal" element={<DoctorPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
