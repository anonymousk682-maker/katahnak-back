// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for better UX
  const { login, isAuthenticated } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { ok, error } = await login({ email, password });
      if (ok) {
        nav('/admin/dashboard');
      } else {
        alert(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      alert('An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    // Using replace ensures the user can't navigate back to the login page easily
    nav('/admin/dashboard', { replace: true }); 
    return null;
  }

  return (
    // Centered container with max width for responsiveness and the card aesthetic
    <div 
      className="max-w-md mx-auto my-20 p-8 rounded-2xl shadow-2xl card-surface text-white" 
    >
      <h2 
        className="text-3xl font-extrabold mb-8 text-center" 
        style={{ color: 'var(--accent-light)' }}
      >
        Admin Login
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Input */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-[var(--muted)]" htmlFor="email">
            Email
          </label>
          <input 
            id="email"
            className="input-field w-full p-3 rounded-lg transition duration-200" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
        </div>
        
        {/* Password Input */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-[var(--muted)]" htmlFor="password">
            Password
          </label>
          <input 
            id="password"
            className="input-field w-full p-3 rounded-lg transition duration-200" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-6 px-6 py-3 rounded-full text-lg font-semibold bg-[var(--accent)] text-slate-900 shadow-md hover:bg-[var(--accent-light)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        This portal is for administrators only.
      </p>
    </div>
  );
}