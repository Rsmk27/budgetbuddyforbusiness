
import React from 'react';

interface SettingsPageProps {
  onClearData: () => void;
  onLogout: () => void;
  currentUser: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClearData, onLogout, currentUser }) => {

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all your data for this account? This action cannot be undone.")) {
      onClearData();
      alert("All application data for this account has been cleared.");
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold mb-6 text-text-light dark:text-text-dark">Settings</h2>
      
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">Account</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
          You are currently signed in as <span className="font-semibold text-primary">{currentUser}</span>.
        </p>
        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <button
            onClick={onLogout}
            className="bg-secondary text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">Data Management</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
          Manage your application data here. Be careful, these actions are irreversible.
        </p>
        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <button
            onClick={handleClearData}
            className="bg-negative text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Clear All Account Data
          </button>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
            This will permanently delete all your transactions and budgets for the current account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
