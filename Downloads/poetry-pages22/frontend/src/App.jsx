import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Poems from './pages/Poems';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  // Define a padding value to clear the fixed header (approx. 64px or 4rem)
  const headerHeightPadding = '64px'; 

  return (
    <div>
      <Header />
      <main 
        // 💡 ADDED: paddingTop to offset the fixed header
        // 💡 MODIFIED: Removed redundant 'padding: 20px' and rely on container-max/global styles for horizontal padding.
        className="container-max" 
        style={{ 
          paddingTop: headerHeightPadding, 
          maxWidth: 1100, 
          margin: '0 auto' 
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poems" element={<Poems />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}