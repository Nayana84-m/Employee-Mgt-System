import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, CalendarOff, IndianRupee, Plus, ArrowRight, Activity, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, deptData] = await Promise.all([
        api.getStats(),
        api.getDepartments()
      ]);
      setStats(statsData);
      setDepartments(deptData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data from Express API');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        <AlertTriangle size={32} className="mx-auto mb-2 text-red-500" />
        <h3 className="font-bold text-lg">Unable to connect to Express Backend</h3>
        <p className="text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 text-white font-medium text-xs rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={Users}
          color="indigo"
          change="Active workforce"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments || 0}
          icon={Building2}
          color="emerald"
          change="Operational units"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pendingLeaves || 0}
          icon={CalendarOff}
          color="amber"
          change="Requires action"
        />
        <StatCard
          title="Monthly Payroll"
          value={`₹${(stats?.totalMonthlyPayroll || 0).toLocaleString()}`}
          icon={IndianRupee}
          color="purple"
          change="Total salary outlay"
        />
      </div>

      {/* 2. Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Quick Executive Actions</h3>
            <p className="text-xs text-indigo-200 mt-1">Manage workforce records and leave requests with one click.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/employees', { state: { openAddModal: true } })}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus size={16} />
              Add Employee
            </button>
            <button
              onClick={() => navigate('/employees')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-xs transition-all"
            >
              <Users size={16} />
              View Employees
            </button>
            <button
              onClick={() => navigate('/leaves')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-xs transition-all"
            >
              <CalendarOff size={16} />
              Manage Leaves
            </button>
          </div>
        </div>
      </div>

      {/* 3. Grid Section: Department Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Overview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Department Payroll & Overview</h3>
              <p className="text-xs text-gray-500">Employee distribution and allocated budgets</p>
            </div>
            <button
              onClick={() => navigate('/departments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{dept.name}</span>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {dept.employeeCount} {dept.employeeCount === 1 ? 'employee' : 'employees'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900 block">₹{dept.totalSalary.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400">Cap: ₹{dept.salaryCap.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar / Cap Alert */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${
                      dept.capExceeded ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min((dept.totalSalary / dept.salaryCap) * 100, 100)}%` }}
                  ></div>
                </div>

                {dept.capExceeded && (
                  <p className="mt-2 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                    <AlertTriangle size={13} />
                    ⚠ Salary Cap Exceeded: Exceeded allocated threshold by ₹{(dept.totalSalary - dept.salaryCap).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Stream (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" />
              Recent Activity
            </h3>
          </div>

          <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-white"></div>
              <p className="text-xs font-bold text-gray-900">Vivek Reddy applied for Sick Leave</p>
              <p className="text-[10px] text-gray-400 mt-0.5">IT Dept • 4 days request (Pending)</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white"></div>
              <p className="text-xs font-bold text-gray-900">Priya Menon's Leave Approved</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Marketing Dept • Vacation Leave</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white"></div>
              <p className="text-xs font-bold text-gray-900">October Payroll Processed</p>
              <p className="text-[10px] text-gray-400 mt-0.5">10 employees total net disbursement</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-white"></div>
              <p className="text-xs font-bold text-gray-900">New Department Audit</p>
              <p className="text-[10px] text-gray-400 mt-0.5">IT Department Salary Threshold Flagged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
