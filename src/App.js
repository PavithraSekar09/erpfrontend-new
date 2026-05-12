import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from "./modules/employee/AddEmployee";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeList from "./modules/employee/EmployeeList";
import EditEmployee from "./modules/employee/EditEmployee";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/Protectedroute";
import Attendance from "./modules/attendance/Attendance";
import LeaveList from "./modules/leave/LeaveList";
import LeaveRequest from "./modules/leave/LeaveRequest";
import MyLeaves from "./modules/leave/MyLeaves";
import Register from "./pages/Register";
import AdminAttendance from "./modules/attendance/AdminAttendance";
import MyProfile from "./modules/employee/MyProfile";
import Finance from "./pages/Finance";
import Sales from "./pages/Sales";
import Product from "./pages/Product";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE MANAGEMENT */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <EmployeeList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-employee"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AddEmployee />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-employee/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <EditEmployee />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ATTENDANCE */}
        <Route
          path="/admin-attendance"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AdminAttendance />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN LEAVE */}
        <Route
          path="/leave-list"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <LeaveList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN FINANCE */}
        <Route
          path="/admin-finance"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <Finance />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN SALES */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <Sales />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN PRODUCT */}
        <Route
          path="/product"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <Product />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE DASHBOARD */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout>
                <UserDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE ATTENDANCE */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout>
                <Attendance />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE LEAVE */}
        <Route
          path="/leave"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout>
                <LeaveRequest />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout>
                <MyLeaves />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout>
                <MyProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;