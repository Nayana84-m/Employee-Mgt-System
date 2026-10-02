import React, { useState, useEffect } from 'react';
import { CalendarOff, CheckCircle2, Clock, Filter, AlertCircle } from 'lucide-react';
import LeaveTable from '../components/LeaveTable';
import { api } from '../api';

const Leaves = ({ userRole = 'Admin' }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  // CUSTOM FEATURE 2: Dynamic Filter Tab state
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLeaves();
      setLeaves(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leave records.');
    } finally {
      setLoading(false);
    }
  };

  // Status Update Handler (Approve / Reject)
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateLeaveStatus(id, status);
      setToast(`Leave request #${id} marked as ${status}.`);
      fetchLeaves();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update leave status');
    }
  };

  // CUSTOM FEATURE 2 DYNAMIC COUNTS CALCULATION
  const counts = {
    All: leaves.length,
    Pending: leaves.filter(l => l.status === 'Pending').length,
    Approved: leaves.filter(l => l.status === 'Approved').length,
    Rejected: leaves.filter(l => l.status === 'Rejected').length,
  };

  // Filtered leave records based on active tab
  const filteredLeaves = leaves.filter(leave => {
    if (selectedFilter === 'All') return true;
    return leave.status === selectedFilter;
  });

  const filterTabs = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-xs text-gray-500">Review employee leave requests, approve or reject applications</p>
        </div>
      </div>

      {/* CUSTOM FEATURE 2: DYNAMIC FILTER TABS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Custom Feature 2: Dynamic Status Filter Tabs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-2">
          {filterTabs.map((tab) => {
            const count = counts[tab];
            const isActive = selectedFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : tab === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : tab === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Fetching Leave Applications...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-semibold">
          <AlertCircle size={20} className="mx-auto mb-2 text-red-500" />
          {error}
        </div>
      ) : (
        <LeaveTable
          leaves={filteredLeaves}
          onUpdateStatus={handleUpdateStatus}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default Leaves;
