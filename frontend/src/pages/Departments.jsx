import React, { useState, useEffect } from 'react';
import { Building2, Plus, AlertTriangle, CheckCircle, Users, IndianRupee, UserCheck } from 'lucide-react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  // Add Department Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({
    name: '',
    salaryCap: '',
    manager: '',
    description: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch departments.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!deptForm.name || !deptForm.salaryCap || !deptForm.manager) {
      setFormError('Please fill in all required fields (Name, Salary Cap, Manager).');
      return;
    }

    try {
      await api.createDepartment(deptForm);
      setToast(`Department "${deptForm.name}" created successfully!`);
      setIsModalOpen(false);
      setDeptForm({ name: '', salaryCap: '', manager: '', description: '' });
      fetchDepartments();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to create department.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Department Management</h2>
          <p className="text-xs text-gray-500">Monitor budget caps, employee distribution, and department leads</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Feature Highlight Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">Custom Feature 1: Dynamic Salary Cap Alert System</h4>
          <p className="text-xs mt-0.5 text-amber-800">
            The system automatically calculates the sum of all employee salaries in each department. If the total exceeds the department's allocated salary threshold, a prominent warning alert is displayed dynamically.
          </p>
        </div>
      </div>

      {/* Grid of Departments */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Calculating Department Allocations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-semibold">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const usagePercentage = Math.min(Math.round((dept.totalSalary / dept.salaryCap) * 100), 100);

            return (
              <div
                key={dept.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
                  dept.capExceeded ? 'border-rose-300 ring-2 ring-rose-100' : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        dept.capExceeded ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{dept.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">Head: {dept.manager}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{dept.description}</p>

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-100 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block">Staff Count</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                        <Users size={14} className="text-indigo-600" />
                        {dept.employeeCount} Employees
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block">Salary Sum</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                        <IndianRupee size={14} className="text-emerald-600" />
                        ₹{dept.totalSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Salary Cap Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1 font-medium">
                      <span className="text-gray-500">Allocated Cap</span>
                      <span className="text-gray-900 font-bold">₹{dept.salaryCap.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          dept.capExceeded ? 'bg-rose-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* CUSTOM FEATURE 1 ALERT BOX */}
                <div>
                  {dept.capExceeded ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-800 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        ⚠ Salary Cap Exceeded
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        This department has exceeded the allocated salary limit by <strong className="underline">₹{(dept.totalSalary - dept.salaryCap).toLocaleString()}</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <span>Within Salary Cap Limit</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Department"
      >
        <form onSubmit={handleAddDepartment}>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {formError}
            </div>
          )}

          <FormInput
            label="Department Name"
            value={deptForm.name}
            onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
            placeholder="e.g. Quality Assurance"
            required
          />

          <FormInput
            label="Salary Cap Limit (₹)"
            type="number"
            value={deptForm.salaryCap}
            onChange={(e) => setDeptForm({ ...deptForm, salaryCap: e.target.value })}
            placeholder="e.g. 120000"
            required
          />

          <FormInput
            label="Department Manager / Lead"
            value={deptForm.manager}
            onChange={(e) => setDeptForm({ ...deptForm, manager: e.target.value })}
            placeholder="e.g. Arjun Kumar"
            required
          />

          <FormInput
            label="Department Description"
            type="textarea"
            value={deptForm.description}
            onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
            placeholder="Brief overview of department responsibilities..."
          />

          <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-gray-100">
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
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
