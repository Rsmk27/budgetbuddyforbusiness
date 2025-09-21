
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  icon: string;
  label: string;
}> = ({ page, currentPage, onPageChange, icon, label }) => {
  const isActive = currentPage === page;
  return (
    <li className="mb-2">
      <a
        href={`#${page}`}
        onClick={() => onPageChange(page)}
        className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary/20 text-primary font-semibold'
            : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <i className={`fas ${icon} w-5 text-center`}></i>
        <span>{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isDarkMode, onThemeToggle }) => {
  return (
    <aside className="bg-card-light dark:bg-card-dark p-6 shadow-lg md:w-64 flex-shrink-0 flex flex-col justify-between border-r border-border-light dark:border-border-dark">
      <div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-primary mb-10">
            <i className="fas fa-wallet"></i>
            <span>Budget Buddy</span>
        </div>
        <nav>
          <ul>
            <NavItem page={Page.Dashboard} currentPage={currentPage} onPageChange={onPageChange} icon="fa-tachometer-alt" label="Dashboard" />
            <NavItem page={Page.Income} currentPage={currentPage} onPageChange={onPageChange} icon="fa-hand-holding-usd" label="Income" />
            <NavItem page={Page.Expenses} currentPage={currentPage} onPageChange={onPageChange} icon="fa-money-bill-wave" label="Expenses" />
            <NavItem page={Page.Budgets} currentPage={currentPage} onPageChange={onPageChange} icon="fa-piggy-bank" label="Budgets" />
            <NavItem page={Page.Reports} currentPage={currentPage} onPageChange={onPageChange} icon="fa-chart-pie" label="Reports" />
            <NavItem page={Page.Settings} currentPage={currentPage} onPageChange={onPageChange} icon="fa-cog" label="Settings" />
          </ul>
        </nav>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
          <span className="text-sm font-medium text-text-light dark:text-text-dark">
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isDarkMode} onChange={onThemeToggle} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
