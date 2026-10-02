# RV UNIVERSITY, BENGALURU-560059
## SCHOOL OF COMPUTER SCIENCE AND ENGINEERING

---

# A PROJECT REPORT ON
# EMPLOYEE MANAGEMENT SYSTEM (EMS)

**Submitted in Fulfillment for the award of degree of**  
**B.Sc. (Honors) / B.Tech in Computer Science and Engineering**  
**Course Code:** CS3301 – Full Stack Development (CIE-2 React Mini Project)  

**Academic Year:** 2025–2026  

---

### **Submitted By:**
- **Name:** [Student Name] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **USN:** [Student USN]

### **Under the Guidance of:**
- **Faculty Guide:** Dr. / Prof. [Guide Name]
- **Designation:** Assistant Professor / Associate Professor
- **School of Computer Science and Engineering**  
- **RV University, Bengaluru-560059**

---

## ABSTRACT

This project focuses on designing and implementing a modern, robust **Employee Management System (EMS)** web application to automate workforce management, department budget tracking, leave processing, and payroll calculation. The primary objective is to build a full-stack, real-time interactive web application using **React.js, Express.js, and Tailwind CSS** that operates seamlessly without external database dependencies by storing application state in Express in-memory JavaScript data structures.

The system features complete **Role-Based Access Control (RBAC)** separating the **Administrator Portal** from the **Employee Self-Service Workspace**. Administrators execute full CRUD operations on employee profiles, monitor department salary caps, process leave applications, and inspect company payroll. Employees receive a dedicated workspace to manage their profile, view personal salary breakdowns, and apply for leave with real-time status synchronization. Comprehensive error handling is implemented across client-side controlled forms, API error banners, toast notifications, and a React `ErrorBoundary` class component.

---

## TABLE OF CONTENTS

1. **Introduction**
2. **Problem Statement & Objectives**
3. **Technologies Used**
4. **Selected YouTube Tutorial & Inspiration**
5. **System / Component Architecture**
6. **Important React Concepts Implemented**
7. **Express REST API Architecture & Endpoints**
8. **Client & Server Error Handling Architecture**
9. **Detailed Modifications Made (Beyond Reference Tutorial)**
10. **Screenshots & UI Walkthrough**
11. **Challenges Faced & Solutions**
12. **Conclusion**
13. **Git Links & References**

---

## 1. INTRODUCTION

The **Employee Management System (EMS)** is an enterprise web application engineered to streamline human resource management, staff administration, leave workflows, and compensation tracking. Modern organizational efficiency depends on transparent digital portals that allow human resource managers to oversee operations while empowering employees with self-service capabilities.

This project implements a single-page application (SPA) architecture utilizing **Vite + React.js** on the frontend and a **Node.js + Express.js** REST API backend. The system enforces strict role-based separation between managerial administrative functions and employee self-service capabilities.

---

## 2. PROBLEM STATEMENT & OBJECTIVES

### Problem Statement
Traditional tutorial projects for Employee Management Systems often provide single-view admin dashboards where all users see administrative controls, employee salaries, and global company stats. This lacks real-world security separation and fails to demonstrate how an employee interacts with an HR system in a corporate environment. Furthermore, static HR tools lack real-time budget threshold alerts, leaving department managers unaware when total salaries exceed allocated budget limits. Finally, tutorial projects frequently lack robust form validation and error handling, leading to silent UI failures.

### Primary Objectives
1. **Full-Stack REST Architecture:** Establish client-server communication using Express REST APIs (`GET`, `POST`, `PUT`, `DELETE`).
2. **Role-Based Access Control (RBAC):** Architect separate Admin and Employee views with protected routes (`ProtectedRoute.jsx`) and role-specific API filtering.
3. **Dynamic Budget Monitoring (Modification 1):** Calculate live total department salaries from employee records and trigger dynamic `⚠ Salary Cap Exceeded` alerts when thresholds are breached.
4. **Interactive Leave Application Workflow (Modification 2):** Connect employee leave applications directly to the Admin approval board, allowing real-time status updates (`Pending` $\rightarrow$ `Approved` / `Rejected`).
5. **Comprehensive Error Handling:** Implement input validation messages, HTTP error handling, toast notifications, and a React Class Component Error Boundary.
6. **Database-Free Persistence:** Store data using structured JavaScript arrays in memory while adhering strictly to assignment constraints.

---

## 3. TECHNOLOGIES USED

### Frontend
- **React.js (v18):** Declarative component-based UI library.
- **Vite:** Next-generation frontend build tool and dev server.
- **Tailwind CSS (v3):** Utility-first CSS framework for responsive layout design.
- **React Router DOM (v6):** Client-side routing and protected route guards.
- **Lucide React:** Modern SVG icon library.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for building REST APIs.
- **CORS Middleware:** Enables cross-origin resource sharing between frontend (Port 5173) and backend (Port 5000).

---

## 4. SELECTED YOUTUBE TUTORIAL & INSPIRATION

- **Tutorial Title:** *MERN Stack Employee Management System – Project Overview & File Structure (Part 1)*
- **Channel Name:** Code With Yousaf
- **YouTube Link:** [https://youtu.be/P_L-06VRcBI?si=-vIy8FhUseQ4yG0r](https://youtu.be/P_L-06VRcBI?si=-vIy8FhUseQ4yG0r)
- **Role of Reference:** Used as foundational design inspiration for the Employee Management concept. All UI layouts, backend APIs, role separation logic, custom features, error handling, and component hierarchies were written specifically to satisfy CS3301 project rubric requirements.

---

## 5. SYSTEM / COMPONENT ARCHITECTURE

```text
                               WorkPulse EMS System Architecture
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
             ADMIN ROLE (admin@ems.com)                     EMPLOYEE ROLE (rahul@ems.com)
                    │                                                   │
       ┌────────────┴────────────┐                         ┌────────────┴────────────┐
       │                         │                         │                         │
Admin Dashboard            Management Modules          Self-Service Workspace     Personal Modules
───────┬───────            ──────────┬───────          ───────────┬──────────     ────────┬───────
 • Stat Cards               • Employees (CRUD)          • Welcome Overview             • My Profile
 • Dept Overview            • Departments               • Leave Balance                • My Leaves
 • Recent Activity          • Leaves (Approve/Reject)   • Quick Apply Leave            • My Salary
                            • Payroll Records
```

### Folder Hierarchy
```text
D:\FSD_ClassSem5\Employee-Mgt-System\
├── backend/
│   ├── package.json
│   ├── server.js             # Express REST API & In-Memory Data Arrays
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.js        # Vite Config
│   ├── tailwind.config.js    # Tailwind Config
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx            # Header & Clickable Profile Pill
│       │   ├── Sidebar.jsx           # Role-based Navigation Sidebar
│       │   ├── ProtectedRoute.jsx    # Role Security Guard
│       │   ├── StatCard.jsx          # Reusable Metric Card
│       │   ├── EmployeeCard.jsx      # Reusable Employee Card
│       │   ├── LeaveTable.jsx        # Reusable Leave Table
│       │   ├── FormInput.jsx         # Controlled Input with Error Styling
│       │   ├── StatusBadge.jsx       # Color Badge Indicator
│       │   ├── Modal.jsx             # Reusable Dialog Overlay
│       │   └── ErrorBoundary.jsx     # [CLASS COMPONENT] Error Boundary
│       ├── pages/
│       │   ├── Login.jsx             # Simulated Role Login (/login)
│       │   ├── AdminDashboard.jsx    # Executive Metrics (/admin-dashboard)
│       │   ├── AdminProfile.jsx      # Admin Profile (/admin-profile)
│       │   ├── Employees.jsx         # Employee Directory CRUD (/employees)
│       │   ├── Departments.jsx       # Department Salary Cap Alert (/departments)
│       │   ├── Leaves.jsx            # Admin Leave Processing (/leaves)
│       │   ├── Salary.jsx            # Admin Payroll Breakdown (/salary)
│       │   ├── EmployeeDashboard.jsx # Employee Workspace (/employee-dashboard)
│       │   ├── EmployeeProfile.jsx   # Employee Profile (/employee-profile)
│       │   ├── MyLeaves.jsx          # Employee Personal Leaves (/my-leaves)
│       │   └── MySalary.jsx          # Employee Personal Salary (/my-salary)
│       ├── api.js                    # Fetch REST API Wrapper
│       ├── App.jsx                   # Router & LocalStorage Persistence
│       └── main.jsx                  # React Root Entrypoint
└── README.md                         # Project Documentation
```

---

## 6. IMPORTANT REACT CONCEPTS IMPLEMENTED

| React Concept | Implementation Details | Code File Reference |
| :--- | :--- | :--- |
| **1. Class Component** | `class ErrorBoundary extends React.Component` catching rendering exceptions | `src/components/ErrorBoundary.jsx` |
| **2. Reusable Components** | `StatCard`, `EmployeeCard`, `LeaveTable`, `FormInput`, `StatusBadge`, `Modal` | `src/components/` |
| **3. Parent–Child Communication** | `Employees` $\rightarrow$ `EmployeeCard`, `Leaves` $\rightarrow$ `LeaveTable` passing state & functions | `src/pages/Employees.jsx` |
| **4. Props Passing** | Passing callback handlers (`onEdit`, `onDelete`, `onUpdateStatus`) as props | `src/components/EmployeeCard.jsx` |
| **5. useState Hook** | Controlled forms, search input, department filter, modal visibility, role state | `src/pages/Login.jsx`, `Employees.jsx` |
| **6. useEffect Hook** | Triggering REST API fetch requests on component mount | `src/pages/AdminDashboard.jsx`, `api.js` |
| **7. Event Handling** | `onSubmit`, `onChange`, `onClick`, modal toggle handlers | `src/pages/Employees.jsx` |
| **8. Client Routing** | React Router DOM v6 with `ProtectedRoute` role security guards | `src/App.jsx`, `ProtectedRoute.jsx` |
| **9. Form Validation** | Controlled inputs with strict validation (Email regex, positive salary) | `src/pages/Employees.jsx` |
| **10. Responsive Layout** | Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`), collapsible mobile sidebar drawer | `src/components/Sidebar.jsx` |

---

## 7. EXPRESS REST API ARCHITECTURE & ENDPOINTS

The Express backend server runs on `http://localhost:5000/api` using CORS middleware and JSON parsing.

### Complete REST API Specification Table

| Method | Endpoint | Access Role | Description | HTTP Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Public | Authenticates user credentials and returns role identity | `200 OK` |
| `GET` | `/api/stats` | Admin | Returns aggregated dashboard metrics | `200 OK` |
| `GET` | `/api/employees` | Admin | Retrieves list of all employees | `200 OK` |
| `GET` | `/api/employees/:id` | Shared | Retrieves single employee details | `200 OK` |
| `POST` | `/api/employees` | Admin | Creates new employee record & user login account | `201 Created` |
| `PUT` | `/api/employees/:id` | Admin | Updates existing employee profile | `200 OK` |
| `PUT` | `/api/employees/me/:id` | Employee | Self-updates safe fields (Phone, Email) | `200 OK` |
| `DELETE`| `/api/employees/:id` | Admin | Deletes employee & associated leave/user records | `200 OK` |
| `GET` | `/api/departments` | Admin | Returns departments with dynamic salary sum & cap alert flag | `200 OK` |
| `POST` | `/api/departments` | Admin | Creates new department unit | `201 Created` |
| `GET` | `/api/leaves` | Admin | Retrieves all employee leave applications | `200 OK` |
| `GET` | `/api/leaves/my/:id` | Employee | Retrieves **ONLY** logged-in employee's leave applications | `200 OK` |
| `POST` | `/api/leaves` | Employee | Submits new leave application (`status: Pending`) | `201 Created` |
| `PUT` | `/api/leaves/:id` | Admin | Approves or rejects pending leave application | `200 OK` |
| `GET` | `/api/salary` | Admin | Returns all employee payroll breakdown & summary | `200 OK` |
| `GET` | `/api/salary/my/:id` | Employee | Returns **ONLY** logged-in employee's salary slip | `200 OK` |

---

## 8. CLIENT & SERVER ERROR HANDLING ARCHITECTURE

A critical aspect of production-ready applications is handling errors gracefully without leaving blank screens or silent failures.

```text
                               Error Handling Hierarchy
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
    Client Form Validation         API & Network Errors         React ErrorBoundary
    ──────────────────────         ────────────────────         ───────────────────
     • Red border inputs           • Banner Alert Boxes          • Class Component
     • Field error messages        • Error toast notifications   • Friendly fallback screen
     • Prevent invalid submit      • Express 400/404/500 errors   • Reset & recover button
```

### 1. Client-Side Form Validation ([Employees.jsx](file:///D:/FSD_ClassSem5/Employee-Mgt-System/frontend/src/pages/Employees.jsx))
Forms enforce strict client-side validation rules before invoking REST APIs:
- **Full Name:** Required field.
- **Email:** Required and validated via regex (`/\S+@\S+\.\S+/`).
- **Department & Position:** Required selection.
- **Salary:** Must be a positive number (`salary > 0`).
- **Joining Date:** Required date input.

Validation error messages are rendered dynamically in red below the corresponding input field (`formErrors[name]`), and input borders turn red (`border-red-500`).

### 2. API & Network Error Banners ([AdminDashboard.jsx](file:///D:/FSD_ClassSem5/Employee-Mgt-System/frontend/src/pages/AdminDashboard.jsx))
If the Express backend is offline or an API request fails:
- State updates with `error` message.
- A prominent red banner alert box is displayed with a **Retry Connection** button.
- Blank or broken component trees are avoided.

### 3. Toast Notifications ([MyLeaves.jsx](file:///D:/FSD_ClassSem5/Employee-Mgt-System/frontend/src/pages/MyLeaves.jsx))
Upon successful actions (such as adding an employee, applying for leave, or approving a request), a green toast banner appears for 4 seconds to provide immediate feedback.

### 4. React Error Boundary Class Component ([ErrorBoundary.jsx](file:///D:/FSD_ClassSem5/Employee-Mgt-System/frontend/src/components/ErrorBoundary.jsx))
Implemented using `class ErrorBoundary extends React.Component` with `componentDidCatch`. If any uncaught rendering error occurs in the React component tree:
- The error boundary catches the exception.
- It renders a fallback UI displaying the error message.
- It includes a **Reset & Return to Dashboard** button to safely recover the app state.

---

## 9. DETAILED MODIFICATIONS MADE (BEYOND REFERENCE TUTORIAL)

### MODIFICATION 1: Role-Based Employee Self-Service Portal & API Filtering
- **Tutorial Base:** Code With Yousaf's reference video focuses primarily on an Admin management portal where all logged-in accounts view company-wide statistics and admin management buttons.
- **Our Enhancement:**
  1. **UI Separation:** Employees receive a separate self-service workspace (`/employee-dashboard`, `/employee-profile`, `/my-leaves`, `/my-salary`). They cannot access or view other employees' profiles or salary figures.
  2. **API Filtering:** Dedicated backend endpoints (`GET /api/leaves/my/:id`, `GET /api/salary/my/:id`, `GET /api/employees/me/:id`) ensure data is filtered at the API level.
  3. **Real-Time Synchronized Workflow:** When an employee submits a leave request, it appears as `Pending` on the Admin Leave Management page. When the Admin clicks `Approve` or `Reject`, the status updates dynamically on the employee's **My Leaves** page.

### MODIFICATION 2: Department Salary Cap Alert System
- **Location:** `src/pages/Departments.jsx` (API: `GET /api/departments`)
- **Our Enhancement:** The backend calculates the sum of all employee salaries in each department dynamically. If `totalSalary > salaryCap`, a warning banner is rendered:
  ```text
  ⚠ Salary Cap Exceeded
  This department has exceeded the allocated salary limit by ₹[Amount].
  ```
  If within budget limit, it displays `✓ Within Salary Cap Limit`.

### MODIFICATION 3: Dynamic Status Filter Tabs with Live Counters
- **Location:** `src/pages/Leaves.jsx`
- **Our Enhancement:** Interactive status tabs (`All`, `Pending`, `Approved`, `Rejected`) with live counters computed from state (`All (8)`, `Pending (3)`, `Approved (3)`, `Rejected (2)`). Clicking a tab filters rows instantly without reloading.

---

## 10. SCREENSHOTS & UI WALKTHROUGH

### 1. Login Screen (`/login`)
- Role toggle between **Admin** and **Employee**.
- 1-Click Demo Fill buttons for `admin@ems.com`, `rahul@ems.com`, and `sneha@ems.com`.

### 2. Admin Dashboard (`/admin-dashboard`)
- Stat Cards: Total Employees, Departments, Pending Leaves, Monthly Payroll.
- Department Overview with progress bars and salary cap warnings.

### 3. Employee Directory (`/employees`)
- Full CRUD operations with search bar and department dropdown filter.
- Controlled Add/Edit Employee modal with client-side validation.

### 4. Department Management (`/departments`)
- Department cards with budget allocation progress bars and dynamic **Salary Cap Alerts**.

### 5. Admin Leave Management (`/leaves`)
- Interactive status filter tabs with dynamic counts.
- **Approve** and **Reject** buttons to process leave applications.

### 6. Employee Self-Service Portal (`/employee-dashboard`, `/my-leaves`, `/my-salary`, `/employee-profile`)
- Personal welcome banner, individual leave application form modal, personal payslip computation.

---

## 11. CHALLENGES FACED & SOLUTIONS

1. **Challenge: Restricting Employee Data View without a Database**
   - *Solution:* Created specialized Express API routes (`/api/leaves/my/:employeeId` and `/api/salary/my/:employeeId`) that filter in-memory JavaScript arrays on the server before sending response payloads.

2. **Challenge: Session Persistence across Page Reloads**
   - *Solution:* Serialized `currentUser` JSON to browser `localStorage` on login and restored it during React application initialization.

3. **Challenge: Class Component Requirement in Modern React**
   - *Solution:* Implemented `ErrorBoundary.jsx` using `class ErrorBoundary extends React.Component` with `componentDidCatch` to catch rendering exceptions gracefully.

---

## 12. CONCLUSION

The **Employee Management System (EMS)** successfully fulfills all requirements of the CS3301 Full Stack Development CIE-2 React Mini Project. It demonstrates a production-grade full-stack architecture using React.js, Express.js, and Tailwind CSS. The project successfully expands upon the reference YouTube tutorial by implementing role-based authorization, dynamic department salary cap alerts, an employee self-service workflow, and comprehensive error handling.

---

## 13. GIT LINKS AND REFERENCES

- **Project GitHub Repository:** [Insert Student GitHub Link Here]
- **Reference YouTube Tutorial:** *MERN Stack Employee Management System – Project Overview & File Structure (Part 1)* by Code With Yousaf  
  **Link:** [https://youtu.be/P_L-06VRcBI?si=-vIy8FhUseQ4yG0r](https://youtu.be/P_L-06VRcBI?si=-vIy8FhUseQ4yG0r)
- **Official Documentation:** React.js Docs, Express.js Guide, Tailwind CSS Documentation.
