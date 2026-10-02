import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User } from 'lucide-react';

const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard', currentUser }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser?.role === 'admin') {
      navigate('/admin-profile');
    } else {
      navigate('/employee-profile');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger menu for mobile & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{pageTitle}</h2>
          <p className="text-xs text-gray-500 hidden sm:block">CS3301 Full Stack Development Mini Project</p>
        </div>
      </div>

      {/* Right side: Search, Notifications & Interactive User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search portal..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900"
          />
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>

        {/* CLICKABLE USER PROFILE PILL */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all cursor-pointer text-left group"
          title="Click to open profile details"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <User size={16} />
          </div>
          <div className="hidden sm:block">
            <span className="block text-xs font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {currentUser?.name || 'Logged User'}
            </span>
            <span className="block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
              {currentUser?.role === 'admin' ? 'Administrator' : 'Employee'}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
