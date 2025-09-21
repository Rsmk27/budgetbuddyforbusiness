// FIX: Provide full implementation for the LoginPage component.
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      // In a real app, you'd validate credentials against a server.
      // Here, we'll just log in with the username.
      login(username);
    } else {
      setError('Please enter a username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-card-light dark:bg-card-dark rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-primary mb-4">
                <i className="fas fa-wallet"></i>
                <span>Budget Buddy</span>
            </div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., jane.doe"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
