import React, { useState, useEffect } from 'react';
import { CreditCard, IndianRupee, Download, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../api';

const MySalary = ({ currentUser }) => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMySalary();
  }, [currentUser]);

  const fetchMySalary = async () => {
    if (!currentUser?.employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getMySalary(currentUser.employeeId);
      setSalary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your salary details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading Salary Slip...</p>
        </div>
      </div>
    );
  }

  if (error || !salary) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-semibold">
        {error || 'Unable to load salary records.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Salary & Compensation</h2>
          <p className="text-xs text-gray-500">Pay Period: <strong>{salary.payPeriod || 'October 2026'}</strong></p>
        </div>

        <button
          onClick={() => alert("Payslip PDF downloaded successfully (Simulated).")}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Download size={16} />
          Download Payslip PDF
        </button>
      </div>

      {/* Net Salary Highlight Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest block mb-1">
            Total Monthly Net Disbursement
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">₹{salary.netSalary.toLocaleString()}</h1>
          <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} />
            Directly credited to bank account • {salary.paymentStatus}
          </p>
        </div>

        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs text-center min-w-[160px]">
          <span className="text-[10px] text-gray-300 uppercase font-bold block">Status</span>
          <div className="mt-1">
            <StatusBadge status={salary.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Breakdown Details Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
          Salary Computation Breakdown
        </h3>

        <div className="space-y-4 text-xs">
          {/* Basic Salary */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block text-sm">Basic Salary</span>
              <span className="text-[10px] text-gray-400">70% of gross pay scale</span>
            </div>
            <span className="font-mono text-base font-bold text-gray-900">₹{salary.basicSalary.toLocaleString()}</span>
          </div>

          {/* Allowances */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-900">
            <div>
              <span className="font-bold text-emerald-950 block text-sm">Allowances (HRA, Special, Conveyance)</span>
              <span className="text-[10px] text-emerald-700">35% additional benefit additions</span>
            </div>
            <span className="font-mono text-base font-bold text-emerald-700">+₹{salary.allowances.toLocaleString()}</span>
          </div>

          {/* Deductions */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-900">
            <div>
              <span className="font-bold text-rose-950 block text-sm">Deductions (PF, Professional Tax)</span>
              <span className="text-[10px] text-rose-700">5% statutory deductions</span>
            </div>
            <span className="font-mono text-base font-bold text-rose-700">-₹{salary.deductions.toLocaleString()}</span>
          </div>

          {/* Net Calculation Summary */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-gray-900">
            <span>Net Take-Home Salary</span>
            <span className="font-mono text-xl text-indigo-600">₹{salary.netSalary.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalary;
