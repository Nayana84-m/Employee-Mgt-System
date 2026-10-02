import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Send, CheckCircle2, Clock, CalendarOff } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../api';

const MyLeaves = ({ currentUser }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  // Apply Leave Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchMyLeaves();
  }, [currentUser]);

  const fetchMyLeaves = async () => {
    if (!currentUser?.employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyLeaves(currentUser.employeeId);
      setLeaves(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your leave applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      alert("Please fill in all leave request fields.");
      return;
    }

    try {
      await api.createLeave({
        employeeId: currentUser.employeeId,
        ...leaveForm
      });

      setToast('Leave request submitted successfully! It is now pending Admin approval.');
      setIsModalOpen(false);
      setLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchMyLeaves();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit leave application.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Leave Applications</h2>
          <p className="text-xs text-gray-500">Track and manage your leave requests and review approval statuses</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={16} />
          Apply for Leave
        </button>
      </div>

      {/* Leave Table / Empty State */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading your leave records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-semibold">
          {error}
        </div>
      ) : leaves.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CalendarOff size={40} className="text-gray-300 mx-auto mb-3" />
          <h4 className="font-bold text-gray-800 text-base">No Leave Requests Found</h4>
          <p className="text-xs text-gray-500 mt-1">You have not submitted any leave applications yet. Click 'Apply for Leave' to create one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Applied On</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td className="py-3.5 px-4 text-gray-900 font-semibold">
                      {leave.days} {leave.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {leave.appliedOn || 'Recent'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={leave.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleLeaveSubmit}>
          <FormInput
            label="Leave Type"
            type="select"
            value={leaveForm.leaveType}
            onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
            options={['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity/Paternity']}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              required
            />
          </div>
          <FormInput
            label="Reason for Leave"
            type="textarea"
            placeholder="Provide a clear reason for leave..."
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
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
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyLeaves;
