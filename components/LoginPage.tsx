
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email);
    } else {
      alert('Please enter an email address.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-card-light dark:bg-card-dark rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-primary mb-2">
            <i className="fas fa-wallet"></i>
            <span>Business Budget Buddy</span>
          </div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Sign in to access your financial dashboard.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-border-light dark:border-border-dark bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Sign In / Continue
            </button>
          </div>
          <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
            No password needed. Your data is securely linked to your email address on this device.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
