const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Common fetch helper with JSON error handling
 */
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication / Simulated Login
  login: (credentials) => request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Stats (Admin)
  getStats: () => request('/stats'),

  // Employees
  getEmployees: () => request('/employees'),
  getEmployeeById: (id) => request(`/employees/${id}`),
  updateSelfProfile: (id, data) => request(`/employees/me/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  createEmployee: (employeeData) => request('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }),
  updateEmployee: (id, employeeData) => request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  }),
  deleteEmployee: (id) => request(`/employees/${id}`, {
    method: 'DELETE',
  }),

  // Departments
  getDepartments: () => request('/departments'),
  createDepartment: (deptData) => request('/departments', {
    method: 'POST',
    body: JSON.stringify(deptData),
  }),

  // Leaves
  getLeaves: () => request('/leaves'), // Admin: All leaves
  getMyLeaves: (employeeId) => request(`/leaves/my/${employeeId}`), // Employee: Only my leaves
  createLeave: (leaveData) => request('/leaves', {
    method: 'POST',
    body: JSON.stringify(leaveData),
  }),
  updateLeaveStatus: (id, status) => request(`/leaves/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Salary
  getSalary: () => request('/salary'), // Admin: All salaries
  getMySalary: (employeeId) => request(`/salary/my/${employeeId}`), // Employee: Only my salary
};
