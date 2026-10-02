import React, { useState, useEffect } from 'react';
import { CreditCard, IndianRupee, TrendingUp, Award, Download, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../api';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSalary();
      setSalaries(data.salaries || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch payroll data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaries = salaries.filter(s =>
    s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payroll & Salary Records</h2>
          <p className="text-xs text-gray-500">October 2026 Salary disbursements, allowances, and deductions breakdown</p>
        </div>

        <button
          onClick={() => alert("Payroll Report PDF downloaded successfully (Simulated).")}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Download size={16} />
          Export Payroll Summary
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Monthly Payroll</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <IndianRupee size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">₹{(summary?.totalPayroll || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% disbursed on schedule</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Salary</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">₹{(summary?.averageSalary || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-1">Across all 5 departments</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highest Salary</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Award size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">₹{(summary?.highestSalary || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Senior Lead Developer position</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <input
          type="text"
          placeholder="Filter salary table by employee name, position or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Salary Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Calculating Payroll Details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-semibold">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Basic Salary</th>
                  <th className="py-3.5 px-4">Allowances</th>
                  <th className="py-3.5 px-4">Deductions</th>
                  <th className="py-3.5 px-4">Net Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredSalaries.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {s.employeeName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800">{s.department}</div>
                      <div className="text-[10px] text-indigo-600 font-medium">{s.position}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-mono">
                      ₹{s.basicSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-mono font-medium">
                      +₹{s.allowances.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-mono font-medium">
                      -₹{s.deductions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-gray-900 font-mono text-sm">
                      ₹{s.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;
