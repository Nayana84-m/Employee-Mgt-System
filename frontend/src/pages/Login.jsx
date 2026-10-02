import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { api } from '../api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Admin'); // Admin or Employee
  const [email, setEmail] = useState('admin@ems.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setEmail('admin@ems.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@ems.com');
      setPassword('employee123');
    }
    setError('');
  };

  const handleQuickDemoFill = (demoEmail, demoPassword, demoRole) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.login({
        email,
        password,
        role: role.toLowerCase()
      });

      setLoading(false);
      onLoginSuccess(response.user, response.employeeDetails);

      if (response.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-800/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10">
        {/* Brand Header */}
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="w-14 h-14 bg-indigo-600 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            EMS
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WorkPulse EMS</h1>
          <p className="text-xs text-indigo-400 font-medium mt-1">CS3301 Full Stack Development Mini Project</p>
        </div>

        <div className="p-8">
          {/* Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
              Select Portal Access Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleToggle('Admin')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'Admin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <ShieldCheck size={16} />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle('Employee')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'Employee'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <User size={16} />
                Employee
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ems.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Fill Selector for Viva Presentation */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center mb-2 flex items-center justify-center gap-1">
              <KeyRound size={13} className="text-indigo-600" />
              Quick Demo Login Accounts (Viva)
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin@ems.com', 'admin123', 'Admin')}
                className="w-full text-left p-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950 font-medium flex items-center justify-between transition-colors"
              >
                <span>🔑 <strong>Admin:</strong> admin@ems.com</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('rahul@ems.com', 'employee123', 'Employee')}
                className="w-full text-left p-2 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 font-medium flex items-center justify-between transition-colors"
              >
                <span>👤 <strong>Rahul (IT):</strong> rahul@ems.com</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Employee</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('sneha@ems.com', 'employee123', 'Employee')}
                className="w-full text-left p-2 rounded-lg bg-purple-50/70 hover:bg-purple-100/70 text-purple-950 font-medium flex items-center justify-between transition-colors"
              >
                <span>👤 <strong>Sneha (IT):</strong> sneha@ems.com</span>
                <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">Employee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
