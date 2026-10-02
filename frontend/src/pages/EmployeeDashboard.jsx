import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, Clock, FileText, Send, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../api';

const EmployeeDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  
  // New Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    fetchEmployeeDashboardData();
  }, [currentUser]);

  const fetchEmployeeDashboardData = async () => {
    if (!currentUser?.employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [empDetails, leaveList] = await Promise.all([
        api.getEmployeeById(currentUser.employeeId),
        api.getMyLeaves(currentUser.employeeId)
      ]);

      setEmployee(empDetails);
      setLeaves(leaveList);
    } catch (err) {
      console.error("Error loading employee dashboard:", err);
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
        employeeId: employee.id,
        ...leaveForm
      });
      setSubmitSuccess('Leave application submitted successfully to Admin for approval!');
      setIsLeaveModalOpen(false);
      setLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchEmployeeDashboardData();
      
      setTimeout(() => setSubmitSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit leave request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading Employee Workspace...</p>
        </div>
      </div>
    );
  }

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {submitSuccess}
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
            {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'E'}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Employee'} 👋
            </h2>
            <p className="text-xs text-indigo-200 mt-1">
              Position: <strong>{employee?.position || 'Staff Member'}</strong> | Department: <strong>{employee?.department || 'IT'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="w-full md:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Send size={16} />
          Apply for Leave
        </button>
      </div>

      {/* Personal Summary Cards (NO ADMIN COMPANY-WIDE METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: My Department */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Department</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 size={20} /></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{employee?.department || 'IT'}</h3>
          <p className="text-[11px] text-gray-500 mt-1">Lead: {employee?.department === 'IT' ? 'Rahul Sharma' : 'Dept Manager'}</p>
        </div>

        {/* Card 2: My Monthly Salary */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Net Salary</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard size={20} /></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">₹{(employee?.salary || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">October Disbursement: Paid</p>
        </div>

        {/* Card 3: Leave Balance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Balance</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Calendar size={20} /></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">18 Days</h3>
          <p className="text-[11px] text-gray-500 mt-1">12 Casual + 6 Sick Remaining</p>
        </div>

        {/* Card 4: Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Applications</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Clock size={20} /></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{leaves.length} Total</h3>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">{pendingCount} Pending Approval</p>
        </div>
      </div>

      {/* Grid: Quick Shortcuts & Recent Personal Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Personal Leaves (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              My Recent Leave Applications
            </h3>
            <button
              onClick={() => navigate('/my-leaves')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {leaves.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">You have not submitted any leave applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase">
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {leaves.slice(0, 4).map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{leave.leaveType}</td>
                      <td className="py-3 px-4 text-gray-600">{leave.startDate} ({leave.days}d)</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{leave.reason}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={leave.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links & Info (1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Self-Service Shortcuts</h3>
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/employee-profile')}
              className="w-full p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-all"
            >
              <div>
                <span className="block font-semibold text-xs text-gray-900">View My Profile</span>
                <span className="block text-[10px] text-gray-500">Employee ID: {employee?.empIdCode || 'EMP001'}</span>
              </div>
              <ArrowRight size={16} className="text-indigo-600" />
            </button>

            <button
              onClick={() => navigate('/my-salary')}
              className="w-full p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-all"
            >
              <div>
                <span className="block font-semibold text-xs text-gray-900">View My Salary Breakdown</span>
                <span className="block text-[10px] text-gray-500">Basic, Allowances, & Deductions</span>
              </div>
              <ArrowRight size={16} className="text-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
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
            placeholder="Describe the reason for leave..."
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
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

export default EmployeeDashboard;
