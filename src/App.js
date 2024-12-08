
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom'; // Importar Router, Route y Routes
import Login from './Login'; // Importar el componente Login
import UploadFile from './components/UploadFile'; 
import Dashboard from './components/Dashboard'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadFile />} />
      </Routes>
    </Router>
  );
};

export default App;
