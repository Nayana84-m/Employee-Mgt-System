import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarOff, 
  CreditCard, 
  LogOut, 
  ShieldAlert,
  UserCheck,
  User,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    onLogout();
    navigate('/login');
  };

  const isAdmin = currentUser?.role === 'admin';

  // Completely separate Navigation items based on Role
  const adminNavItems = [
    { title: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { title: 'Employees', path: '/employees', icon: Users },
    { title: 'Departments', path: '/departments', icon: Building2 },
    { title: 'Leave Management', path: '/leaves', icon: CalendarOff },
    { title: 'Payroll & Salary', path: '/salary', icon: CreditCard },
  ];

  const employeeNavItems = [
    { title: 'My Dashboard', path: '/employee-dashboard', icon: LayoutDashboard },
    { title: 'My Profile', path: '/employee-profile', icon: User },
    { title: 'My Leaves', path: '/my-leaves', icon: CalendarOff },
    { title: 'My Salary', path: '/my-salary', icon: CreditCard },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
                EMS
              </div>
              <div>
                <h1 className="font-bold text-white text-base leading-tight">WorkPulse EMS</h1>
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">
                  CS3301 Mini Project
                </span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Role & Identity Badge */}
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              {isAdmin ? (
                <ShieldAlert size={14} className="text-amber-400" />
              ) : (
                <UserCheck size={14} className="text-emerald-400" />
              )}
              <span className="capitalize">{currentUser?.role || 'Guest'} Portal</span>
            </div>
            <p className="font-bold text-white text-sm truncate">
              {currentUser?.name || 'User'}
            </p>
            {currentUser?.email && (
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium text-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
