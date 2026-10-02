import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Filter, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import EmployeeCard from '../components/EmployeeCard';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../api';

const Employees = () => {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Form State (Controlled Inputs)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'IT',
    position: '',
    salary: '',
    joiningDate: '',
    status: 'Active'
  });

  // Validation Error State
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
    if (location.state?.openAddModal) {
      handleOpenAddModal();
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to load employee directory.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'IT',
      position: '',
      salary: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      position: emp.position,
      salary: emp.salary.toString(),
      joiningDate: emp.joiningDate,
      status: emp.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Strict Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required.';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.department) errors.department = 'Department is required.';
    if (!formData.position.trim()) errors.position = 'Job Position is required.';

    if (!formData.salary) {
      errors.salary = 'Salary is required.';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      errors.salary = 'Salary must be a valid positive number.';
    }

    if (!formData.joiningDate) errors.joiningDate = 'Joining Date is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, formData);
        showToast(`Successfully updated ${formData.name}'s profile.`);
      } else {
        await api.createEmployee(formData);
        showToast(`Successfully added new employee ${formData.name}.`);
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      alert(err.message || 'Failed to save employee.');
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    const empToDelete = employees.find(e => e.id === id);
    if (!window.confirm(`Are you sure you want to delete ${empToDelete?.name || 'this employee'}?`)) {
      return;
    }

    try {
      await api.deleteEmployee(id);
      showToast('Employee successfully deleted.');
      fetchEmployees();
    } catch (err) {
      alert(err.message || 'Failed to delete employee.');
    }
  };

  // Filter & Search Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  const departmentList = ['All', 'IT', 'HR', 'Finance', 'Marketing', 'Operations'];

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-xs text-gray-500">Manage all staff profiles, departments, and payroll details</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={16} />
          Add New Employee
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search Bar */}
        <div className="sm:col-span-2 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
          >
            {departmentList.map(dept => (
              <option key={dept} value={dept}>
                Department: {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Rendering: Loading / Error / Empty / Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Fetching Employees from API...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs">
          <AlertCircle size={24} className="mx-auto mb-2 text-red-500" />
          <p className="font-bold">{error}</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <h4 className="font-bold text-gray-800 text-base">No Employees Found</h4>
          <p className="text-xs text-gray-500 mt-1">Try clearing search filters or add a new employee profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Employee Controlled Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Edit Employee Profile" : "Add New Employee"}
      >
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Rahul Sharma"
            required
            error={formErrors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="rahul@example.com"
              required
              error={formErrors.email}
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Department"
              type="select"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={['IT', 'HR', 'Finance', 'Marketing', 'Operations']}
              required
              error={formErrors.department}
            />
            <FormInput
              label="Position / Role"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="e.g. Software Engineer"
              required
              error={formErrors.position}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Monthly Salary (₹)"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="45000"
              required
              error={formErrors.salary}
            />
            <FormInput
              label="Joining Date"
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleInputChange}
              required
              error={formErrors.joiningDate}
            />
          </div>

          <FormInput
            label="Status"
            type="select"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={['Active', 'On Leave', 'Inactive']}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              {editingEmployee ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
