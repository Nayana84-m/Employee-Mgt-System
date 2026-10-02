const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Data Storage

// 1. Simulated Users (Admin & Employees)
let users = [
  {
    id: "ADM001",
    name: "System Administrator",
    email: "admin@ems.com",
    password: "admin123",
    role: "admin",
    employeeId: null
  },
  {
    id: "EMP001",
    name: "Rahul Sharma",
    email: "rahul@ems.com",
    password: "employee123",
    role: "employee",
    employeeId: 1
  },
  {
    id: "EMP002",
    name: "Ananya Rao",
    email: "ananya@ems.com",
    password: "employee123",
    role: "employee",
    employeeId: 2
  },
  {
    id: "EMP003",
    name: "Sneha Nair",
    email: "sneha@ems.com",
    password: "employee123",
    role: "employee",
    employeeId: 3
  },
  {
    id: "EMP004",
    name: "Arjun Kumar",
    email: "arjun@ems.com",
    password: "employee123",
    role: "employee",
    employeeId: 4
  },
  {
    id: "EMP005",
    name: "Priya Menon",
    email: "priya@ems.com",
    password: "employee123",
    role: "employee",
    employeeId: 5
  }
];

// 2. Employees Array
let employees = [
  {
    id: 1,
    empIdCode: "EMP001",
    name: "Rahul Sharma",
    email: "rahul@ems.com",
    phone: "+91 98765 43210",
    department: "IT",
    position: "Senior Lead Developer",
    salary: 75000,
    joiningDate: "2022-03-15",
    status: "Active"
  },
  {
    id: 2,
    empIdCode: "EMP002",
    name: "Ananya Rao",
    email: "ananya@ems.com",
    phone: "+91 98123 45678",
    department: "HR",
    position: "HR Operations Manager",
    salary: 52000,
    joiningDate: "2021-07-01",
    status: "Active"
  },
  {
    id: 3,
    empIdCode: "EMP003",
    name: "Sneha Nair",
    email: "sneha@ems.com",
    phone: "+91 97654 32109",
    department: "IT",
    position: "Frontend React Developer",
    salary: 62000,
    joiningDate: "2023-01-10",
    status: "Active"
  },
  {
    id: 4,
    empIdCode: "EMP004",
    name: "Arjun Kumar",
    email: "arjun@ems.com",
    phone: "+91 96543 21098",
    department: "Finance",
    position: "Financial Analyst",
    salary: 58000,
    joiningDate: "2022-09-01",
    status: "Active"
  },
  {
    id: 5,
    empIdCode: "EMP005",
    name: "Priya Menon",
    email: "priya@ems.com",
    phone: "+91 95432 10987",
    department: "Marketing",
    position: "Digital Marketing Specialist",
    salary: 48000,
    joiningDate: "2023-05-20",
    status: "Active"
  },
  {
    id: 6,
    empIdCode: "EMP006",
    name: "Vivek Reddy",
    email: "vivek.reddy@ems.com",
    phone: "+91 94321 09876",
    department: "IT",
    position: "DevOps Engineer",
    salary: 68000,
    joiningDate: "2022-11-15",
    status: "On Leave"
  },
  {
    id: 7,
    empIdCode: "EMP007",
    name: "Kavya Patel",
    email: "kavya.patel@ems.com",
    phone: "+91 93210 98765",
    department: "Operations",
    position: "Operations Lead",
    salary: 54000,
    joiningDate: "2021-12-05",
    status: "Active"
  },
  {
    id: 8,
    empIdCode: "EMP008",
    name: "Rohan Verma",
    email: "rohan.verma@ems.com",
    phone: "+91 92109 87654",
    department: "Finance",
    position: "Senior Auditor",
    salary: 64000,
    joiningDate: "2020-04-18",
    status: "Active"
  },
  {
    id: 9,
    empIdCode: "EMP009",
    name: "Deepika Joshi",
    email: "deepika.joshi@ems.com",
    phone: "+91 91098 76543",
    department: "Marketing",
    position: "Content Strategist",
    salary: 45000,
    joiningDate: "2023-08-12",
    status: "Active"
  },
  {
    id: 10,
    empIdCode: "EMP010",
    name: "Vikram Singh",
    email: "vikram.singh@ems.com",
    phone: "+91 90987 65432",
    department: "Operations",
    position: "Logistics Coordinator",
    salary: 42000,
    joiningDate: "2024-02-01",
    status: "Active"
  }
];

// 3. Departments Array
let departments = [
  {
    id: 1,
    name: "IT",
    salaryCap: 180000, // Threshold for Custom Feature 2
    manager: "Rahul Sharma",
    description: "Software engineering, cloud infrastructure, and IT support."
  },
  {
    id: 2,
    name: "HR",
    salaryCap: 100000,
    manager: "Ananya Rao",
    description: "Talent acquisition, employee wellness, and organizational culture."
  },
  {
    id: 3,
    name: "Finance",
    salaryCap: 110000,
    manager: "Rohan Verma",
    description: "Payroll, accounting, budgeting, and financial auditing."
  },
  {
    id: 4,
    name: "Marketing",
    salaryCap: 85000,
    manager: "Priya Menon",
    description: "Brand campaigns, digital media, social growth, and SEO."
  },
  {
    id: 5,
    name: "Operations",
    salaryCap: 90000,
    manager: "Kavya Patel",
    description: "Daily office logistics, vendor management, and supply chain."
  }
];

// 4. Leaves Array
let leaves = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    department: "IT",
    leaveType: "Casual Leave",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    days: 3,
    reason: "Family function in native town.",
    status: "Pending",
    appliedOn: "2026-10-01"
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: "Rahul Sharma",
    department: "IT",
    leaveType: "Sick Leave",
    startDate: "2026-08-10",
    endDate: "2026-08-11",
    days: 2,
    reason: "Viral fever.",
    status: "Approved",
    appliedOn: "2026-08-09"
  },
  {
    id: 3,
    employeeId: 6,
    employeeName: "Vivek Reddy",
    department: "IT",
    leaveType: "Sick Leave",
    startDate: "2026-10-02",
    endDate: "2026-10-05",
    days: 4,
    reason: "Severe viral fever and doctor recommended bed rest.",
    status: "Pending",
    appliedOn: "2026-10-01"
  },
  {
    id: 4,
    employeeId: 3,
    employeeName: "Sneha Nair",
    department: "IT",
    leaveType: "Casual Leave",
    startDate: "2026-10-10",
    endDate: "2026-10-12",
    days: 3,
    reason: "Attending family function in native place.",
    status: "Pending",
    appliedOn: "2026-09-28"
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: "Priya Menon",
    department: "Marketing",
    leaveType: "Earned Leave",
    startDate: "2026-10-15",
    endDate: "2026-10-20",
    days: 6,
    reason: "Annual vacation trip.",
    status: "Approved",
    appliedOn: "2026-09-20"
  },
  {
    id: 6,
    employeeId: 2,
    employeeName: "Ananya Rao",
    department: "HR",
    leaveType: "Casual Leave",
    startDate: "2026-09-15",
    endDate: "2026-09-16",
    days: 2,
    reason: "Personal work at bank.",
    status: "Approved",
    appliedOn: "2026-09-10"
  },
  {
    id: 7,
    employeeId: 4,
    employeeName: "Arjun Kumar",
    department: "Finance",
    leaveType: "Sick Leave",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    days: 2,
    reason: "Migraine headache.",
    status: "Rejected",
    appliedOn: "2026-09-21"
  }
];

// Helper to generate dynamic salary object for an employee
function getEmployeeSalaryRecord(emp) {
  const basic = Math.round(emp.salary * 0.70);
  const allowances = Math.round(emp.salary * 0.35);
  const deductions = Math.round(emp.salary * 0.05);
  const netSalary = basic + allowances - deductions;

  return {
    id: emp.id,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    position: emp.position,
    basicSalary: basic,
    allowances: allowances,
    deductions: deductions,
    netSalary: netSalary,
    paymentStatus: "Paid",
    payPeriod: "October 2026"
  };
}

function getAllSalaries() {
  return employees.map(emp => getEmployeeSalaryRecord(emp));
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. AUTH / SIMULATED LOGIN API
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;

  const foundUser = users.find(
    u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (role && foundUser.role !== role.toLowerCase()) {
    return res.status(403).json({ error: `Selected role (${role}) does not match user account.` });
  }

  let empDetails = null;
  if (foundUser.employeeId) {
    empDetails = employees.find(e => e.id === foundUser.employeeId);
  }

  res.json({
    message: "Login successful",
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      employeeId: foundUser.employeeId
    },
    employeeDetails: empDetails
  });
});

// 2. STATS (Admin Dashboard)
app.get('/api/stats', (req, res) => {
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);

  res.json({
    totalEmployees,
    totalDepartments,
    pendingLeaves,
    totalMonthlyPayroll
  });
});

// 3. EMPLOYEES APIs (Admin & Self)
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Single employee detail for profile or edit
app.get('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);

  if (!emp) {
    return res.status(404).json({ error: "Employee profile not found." });
  }
  res.json(emp);
});

// Self-update safe fields (Phone, Email only)
app.put('/api/employees/me/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const empIndex = employees.findIndex(e => e.id === id);

  if (empIndex === -1) {
    return res.status(404).json({ error: "Employee profile not found." });
  }

  const { phone, email } = req.body;
  if (phone) employees[empIndex].phone = phone;
  if (email) employees[empIndex].email = email;

  res.json({ message: "Profile updated successfully", employee: employees[empIndex] });
});

// Admin Add Employee
app.post('/api/employees', (req, res) => {
  const { name, email, phone, department, position, salary, joiningDate, status } = req.body;

  if (!name || !email || !department || !position || !salary || !joiningDate) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  const newEmployee = {
    id: newId,
    empIdCode: `EMP0${newId < 10 ? '0' + newId : newId}`,
    name,
    email,
    phone: phone || "+91 99999 88888",
    department,
    position,
    salary: Number(salary),
    joiningDate,
    status: status || "Active"
  };

  employees.push(newEmployee);

  // Also create a simulated user login for this employee
  users.push({
    id: newEmployee.empIdCode,
    name: newEmployee.name,
    email: newEmployee.email,
    password: "employee123",
    role: "employee",
    employeeId: newId
  });

  res.status(201).json(newEmployee);
});

// Admin Update Employee
app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Employee not found." });
  }

  const updatedEmployee = {
    ...employees[index],
    ...req.body,
    id: id,
    salary: req.body.salary ? Number(req.body.salary) : employees[index].salary
  };

  employees[index] = updatedEmployee;
  res.json(updatedEmployee);
});

// Admin Delete Employee
app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = employees.length;
  employees = employees.filter(e => e.id !== id);

  if (employees.length === initialLength) {
    return res.status(404).json({ error: "Employee not found." });
  }

  // Cleanup leaves & user accounts
  leaves = leaves.filter(l => l.employeeId !== id);
  users = users.filter(u => u.employeeId !== id);

  res.json({ message: `Employee #${id} successfully deleted.` });
});

// 4. DEPARTMENTS APIs (Custom Feature 2: Dynamic Salary Cap Alert)
app.get('/api/departments', (req, res) => {
  const departmentData = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept.name);
    const employeeCount = deptEmployees.length;
    const totalSalary = deptEmployees.reduce((sum, e) => sum + e.salary, 0);
    const capExceeded = totalSalary > dept.salaryCap;

    return {
      ...dept,
      employeeCount,
      totalSalary,
      capExceeded
    };
  });

  res.json(departmentData);
});

app.post('/api/departments', (req, res) => {
  const { name, salaryCap, manager, description } = req.body;

  if (!name || !salaryCap || !manager) {
    return res.status(400).json({ error: "Department name, salary cap, and manager are required." });
  }

  if (departments.some(d => d.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ error: "Department already exists." });
  }

  const newDept = {
    id: departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1,
    name,
    salaryCap: Number(salaryCap),
    manager,
    description: description || `${name} Department`
  };

  departments.push(newDept);
  res.status(201).json(newDept);
});

// 5. LEAVES APIs (Role-Based Separation)

// Admin View All Leaves
app.get('/api/leaves', (req, res) => {
  res.json(leaves);
});

// Employee View ONLY Their Own Leaves
app.get('/api/leaves/my/:employeeId', (req, res) => {
  const empId = parseInt(req.params.employeeId);
  const myLeaves = leaves.filter(l => l.employeeId === empId);
  res.json(myLeaves);
});

// Employee Apply for Leave
app.post('/api/leaves', (req, res) => {
  const { employeeId, leaveType, startDate, endDate, reason } = req.body;

  const emp = employees.find(e => e.id === Number(employeeId));
  if (!emp) {
    return res.status(404).json({ error: "Employee not found." });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const newLeave = {
    id: leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 1,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    leaveType,
    startDate,
    endDate,
    days: diffDays > 0 ? diffDays : 1,
    reason,
    status: "Pending",
    appliedOn: new Date().toISOString().split('T')[0]
  };

  leaves.unshift(newLeave);
  res.status(201).json(newLeave);
});

// Admin Approve / Reject Leave
app.put('/api/leaves/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const leaveIndex = leaves.findIndex(l => l.id === id);
  if (leaveIndex === -1) {
    return res.status(404).json({ error: "Leave request not found." });
  }

  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  leaves[leaveIndex].status = status;

  if (status === 'Approved') {
    const empIndex = employees.findIndex(e => e.id === leaves[leaveIndex].employeeId);
    if (empIndex !== -1) {
      employees[empIndex].status = "On Leave";
    }
  }

  res.json(leaves[leaveIndex]);
});

// 6. SALARY APIs (Role-Based Separation)

// Admin View All Salaries & Summary
app.get('/api/salary', (req, res) => {
  const salaryList = getAllSalaries();
  const totalPayroll = salaryList.reduce((sum, item) => sum + item.netSalary, 0);
  const averageSalary = Math.round(totalPayroll / (salaryList.length || 1));
  const highestSalary = Math.max(...salaryList.map(s => s.netSalary), 0);

  res.json({
    salaries: salaryList,
    summary: {
      totalPayroll,
      averageSalary,
      highestSalary
    }
  });
});

// Employee View ONLY Their Own Salary
app.get('/api/salary/my/:employeeId', (req, res) => {
  const empId = parseInt(req.params.employeeId);
  const emp = employees.find(e => e.id === empId);

  if (!emp) {
    return res.status(404).json({ error: "Salary record not found for this employee." });
  }

  const salaryRecord = getEmployeeSalaryRecord(emp);
  res.json(salaryRecord);
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`EMS Backend Server running on http://localhost:${PORT}`);
  console.log(`Endpoints available at http://localhost:${PORT}/api`);
  console.log(`=================================================`);
});
