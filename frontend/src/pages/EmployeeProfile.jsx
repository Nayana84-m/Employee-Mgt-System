import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Edit3, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../api';

const EmployeeProfile = ({ currentUser }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  // Edit Safe Fields Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: '', email: '' });

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser?.employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getEmployeeById(currentUser.employeeId);
      setEmployee(data);
      setProfileForm({ phone: data.phone || '', email: data.email || '' });
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateSelfProfile(employee.id, profileForm);
      setToast('Contact details updated successfully!');
      setIsModalOpen(false);
      fetchProfile();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading Profile Data...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs">
        {error || 'Unable to load profile data.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Banner */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold text-4xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm font-semibold text-indigo-600">{employee.position}</p>
            <p className="text-xs text-gray-500 font-mono">Employee ID: <strong>{employee.empIdCode || `EMP00${employee.id}`}</strong></p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Edit3 size={15} />
            Edit Contact Details
          </button>
        </div>

        {/* Detailed Grid Info */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Mail className="text-indigo-600" size={18} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Email Address</span>
                <span className="font-semibold text-gray-900">{employee.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Phone className="text-indigo-600" size={18} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Phone Number</span>
                <span className="font-semibold text-gray-900">{employee.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Briefcase className="text-indigo-600" size={18} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Department</span>
                <span className="font-semibold text-gray-900">{employee.department}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Calendar className="text-indigo-600" size={18} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Joining Date</span>
                <span className="font-semibold text-gray-900">{employee.joiningDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Lock className="text-amber-600" size={18} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Salary & Role Settings</span>
                <span className="font-semibold text-gray-600">Managed by Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (Safe fields only) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Personal Contact Details"
      >
        <form onSubmit={handleUpdateProfile}>
          <p className="text-xs text-gray-500 mb-4">
            You can update your personal contact details. Position, Department, and Salary can only be modified by the HR/Admin.
          </p>

          <FormInput
            label="Phone Number"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            placeholder="name@ems.com"
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeProfile;
