import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import API from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

  const email = localStorage.getItem("email");

  const [stats, setStats] = useState({
    totalEmployees: 0,
    itEmployees: 0,
    hrEmployees: 0,
    adminCount: 0,
    loading: true,
  });

  const [financeData, setFinanceData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF4D4D"];

  // =========================
  // LOAD ALL DATA
  // =========================
  useEffect(() => {
    loadDashboardData();
    loadAnnouncements();

    // 🔥 REAL TIME ANNOUNCEMENTS
    const interval = setInterval(() => {
      loadAnnouncements();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // =========================
  // DASHBOARD DATA
  // =========================
  const loadDashboardData = async () => {
    try {

      const res = await API.get("/users/employees");
      const employees = res.data;

      const totalEmployees = employees.length;

      const itEmployees = employees.filter(
        (emp) => emp.department?.toUpperCase() === "IT"
      ).length;

      const hrEmployees = employees.filter(
        (emp) => emp.department?.toUpperCase() === "HR"
      ).length;

      const adminCount = 1;

      setStats({
        totalEmployees,
        itEmployees,
        hrEmployees,
        adminCount,
        loading: false,
      });

      const assetRes = await API.get("/admin-finance/assets");
      const revenueRes = await API.get("/admin-finance/revenue");

      const totalAssets = assetRes.data.reduce(
        (sum, item) => sum + (item.purchaseCost || 0),
        0
      );

      const totalRevenue = revenueRes.data.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );

      const net = totalRevenue - totalAssets;

      const profit = net > 0 ? net : 0;
      const loss = net < 0 ? Math.abs(net) : 0;

      setFinanceData([
        { name: "Assets", value: totalAssets },
        { name: "Revenue", value: totalRevenue },
        { name: "Profit", value: profit },
        { name: "Loss", value: loss }
      ]);

    } catch (err) {
      console.log("Dashboard error", err);

      setStats((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  // =========================
  // ANNOUNCEMENTS (REAL TIME)
  // =========================
  const loadAnnouncements = async () => {
    try {
      const res = await API.get("/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      setAnnouncements([]);
    }
  };

  return (
    <div className="admin-wrapper">

      <div className="admin-main">

        {/* HEADER */}
        <div className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {email}</p>
          </div>

          <div className="admin-badge">
            Admin Panel
          </div>

        </div>

        {/* EMPLOYEE CARDS */}
        <div className="stats-grid">

          <div className="stats-card blue">
            <h3>Total Employees</h3>
            <p>{stats.loading ? "..." : stats.totalEmployees}</p>
          </div>

          <div className="stats-card green">
            <h3>IT Department</h3>
            <p>{stats.loading ? "..." : stats.itEmployees}</p>
          </div>

          <div className="stats-card orange">
            <h3>HR Department</h3>
            <p>{stats.loading ? "..." : stats.hrEmployees}</p>
          </div>

          <div className="stats-card purple">
            <h3>Admins</h3>
            <p>{stats.loading ? "..." : stats.adminCount}</p>
          </div>

        </div>

        {/* FINANCE CHART */}
        <div className="chart-box">
          <h2>📊 Business Financial Overview</h2>

          <PieChart width={450} height={320}>
            <Pie
              data={financeData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label
            >
              {financeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* 🔥 ANNOUNCEMENTS (NEW REAL-TIME PANEL) */}
        <div className="announcement-box">

          <h2>📢 Latest Announcements</h2>

          {announcements.length === 0 ? (
            <p>No announcements</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <p>📢 {a.message}</p>
                <small>By {a.createdBy}</small>
              </div>
            ))
          )}

        </div>

        {/* CHILD ROUTES */}
        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;