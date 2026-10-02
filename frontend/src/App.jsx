import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Leaves from './pages/Leaves';
import Salary from './pages/Salary';

// Employee Self-Service Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import MyLeaves from './pages/MyLeaves';
import MySalary from './pages/MySalary';

const Layout = ({ currentUser, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/admin-dashboard':
        return 'Executive Admin Dashboard';
      case '/admin-profile':
        return 'Administrator Profile & Security';
      case '/employees':
        return 'Employee Directory';
      case '/departments':
        return 'Department Allocation & Budget';
      case '/leaves':
        return 'Leave Requests Management';
      case '/salary':
        return 'Payroll & Salary Disbursements';
      case '/employee-dashboard':
        return 'Employee Self-Service Portal';
      case '/employee-profile':
        return 'My Employee Profile';
      case '/my-leaves':
        return 'My Leave Applications';
      case '/my-salary':
        return 'My Salary Breakdown';
      default:
        return 'WorkPulse EMS';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
          currentUser={currentUser}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (user, employeeDetails) => {
    const fullUser = { ...user, employeeDetails };
    setCurrentUser(fullUser);
    localStorage.setItem('ems_user', JSON.stringify(fullUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ems_user');
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate
                  to={currentUser.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'}
                  replace
                />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* ADMIN PROTECTED ROUTES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <AdminProfile currentUser={currentUser} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <Employees />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <Departments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <Leaves userRole="Admin" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salary"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="admin">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <Salary />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* EMPLOYEE PROTECTED ROUTES */}
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="employee">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <EmployeeDashboard currentUser={currentUser} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-profile"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="employee">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <EmployeeProfile currentUser={currentUser} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="employee">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <MyLeaves currentUser={currentUser} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-salary"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="employee">
                <Layout currentUser={currentUser} onLogout={handleLogout}>
                  <MySalary currentUser={currentUser} />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirection */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  !currentUser
                    ? '/login'
                    : currentUser.role === 'admin'
                    ? '/admin-dashboard'
                    : '/employee-dashboard'
                }
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
