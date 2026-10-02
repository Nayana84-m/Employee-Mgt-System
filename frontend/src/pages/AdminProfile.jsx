import React, { useState } from 'react';
import { ShieldCheck, Mail, User, KeyRound, Server, CheckCircle2, Edit3, Lock, Award } from 'lucide-react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';

const AdminProfile = ({ currentUser }) => {
  const [adminData, setAdminData] = useState({
    name: currentUser?.name || 'System Administrator',
    email: currentUser?.email || 'admin@ems.com',
    role: 'System Administrator',
    adminId: 'ADM-001',
    accessLevel: 'Super Administrator (Full System Privileges)',
    lastLogin: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    managedModules: ['Employee Directory', 'Department Budgets', 'Leave Processing', 'Payroll Disbursement']
  });

  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: adminData.name,
    email: adminData.email
  });

  const handleSave = (e) => {
    e.preventDefault();
    setAdminData(prev => ({
      ...prev,
      name: form.name,
      email: form.email
    }));
    setToast('Admin profile details updated successfully!');
    setIsModalOpen(false);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Main Admin Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 text-white font-extrabold text-4xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <ShieldCheck size={48} />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white">{adminData.name}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ★ Administrator
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-300">{adminData.role}</p>
            <p className="text-xs text-slate-400 font-mono">Admin ID: <strong>{adminData.adminId}</strong></p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Edit3 size={15} />
            Edit Admin Profile
          </button>
        </div>

        {/* System Access Badge Row */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs z-10 relative">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <Mail className="text-indigo-400" size={18} />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Admin Email</span>
              <span className="font-semibold text-white">{adminData.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <KeyRound className="text-amber-400" size={18} />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Control Level</span>
              <span className="font-semibold text-white">{adminData.accessLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modules & Responsibilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Server size={18} className="text-indigo-600" />
            Administrative Responsibilities
          </h3>
          <div className="space-y-2">
            {adminData.managedModules.map((module) => (
              <div key={module} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 text-xs font-semibold text-gray-800 border border-gray-100">
                <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                <span>Full Control: {module}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Lock size={18} className="text-amber-600" />
            Security & Session Context
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900">
              <span className="font-bold block mb-0.5">Role Authorization Mode</span>
              <p className="text-[11px] text-amber-800">
                You are currently operating in <strong>Admin Mode</strong>. You have permissions to add, edit, or delete employee records, create departments, approve leave applications, and view payroll.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
              <span className="font-semibold block text-gray-900">Last Session Login</span>
              <span className="text-[11px] text-gray-500">{adminData.lastLogin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Admin Profile Details"
      >
        <form onSubmit={handleSave}>
          <FormInput
            label="Administrator Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. System Administrator"
            required
          />

          <FormInput
            label="Admin Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@ems.com"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Save Admin Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
