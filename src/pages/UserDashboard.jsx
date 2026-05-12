import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });

  const [attendance, setAttendance] = useState(0);
  const [todayStatus, setTodayStatus] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const [userEmail, setUserEmail] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    setUserEmail(email || "User");

    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // =========================
    // LEAVE COUNT
    // =========================
    axios.get("http://localhost:8082/api/leave/count", { headers })
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load leave data"));

    // =========================
    // MONTHLY ATTENDANCE RATE
    // =========================
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    axios.get(
      `http://localhost:8082/api/attendance/rate/month?year=${year}&month=${month}`,
      { headers }
    )
    .then((res) => setAttendance(res.data.rate))
    .catch((err) => console.log(err));

    // =========================
    // TODAY STATUS
    // =========================
    axios.get("http://localhost:8082/api/attendance/my", { headers })
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];

        const todayRecord = res.data.find(
          (a) => a.date === today
        );

        setTodayStatus(todayRecord || null);
      })
      .catch((err) => console.log(err));

    // =========================
    // ANNOUNCEMENTS
    // =========================
    axios.get("http://localhost:8082/api/announcements", { headers })
      .then((res) => setAnnouncements(res.data))
      .catch(() => setAnnouncements([]));

    setLoading(false);

  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cards = [
    { value: stats.total, label: "Total Leaves", class: "blue" },
    { value: stats.pending, label: "Pending Leaves", class: "orange" },
    { value: stats.approved, label: "Approved Leaves", class: "green" },
    { value: `${attendance.toFixed(1)}%`, label: "Attendance Rate", class: "purple" },
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1>Welcome Back 👋</h1>
          <p>{userEmail}</p>
        </div>

        <div className="date-box">{today}</div>
      </div>

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* STATS */}
      <div className="card-grid">

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          cards.map((card, index) => (
            <div key={index} className={`dash-card ${card.class}`}>
              <h2>{card.value}</h2>
              <p>{card.label}</p>
            </div>
          ))
        )}

      </div>

      {/* QUICK ACTIONS */}
      <div className="section">
        <h3>Quick Actions</h3>

        <div className="action-grid">
          <Link to="/attendance">Mark Attendance</Link>
          <Link to="/leave">Apply Leave</Link>
          <Link to="/my-leaves">My Leaves</Link>
          <Link to="/my-profile">My Profile</Link>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="bottom-grid">

        {/* TODAY STATUS (FULL UPGRADED UI) */}
        <div className="panel today-card">

          <h3>Today Status</h3>

          {todayStatus ? (
            <div className="today-content">

              <div className="status-row">
                <span className="label">Check In</span>
                <span className="value">
                  {todayStatus?.checkInTime
                    ? new Date(todayStatus.checkInTime).toLocaleTimeString()
                    : "-"}
                </span>
              </div>

              <div className="status-row">
                <span className="label">Status</span>
                <span className={`badge ${todayStatus.status?.toLowerCase()}`}>
                  {todayStatus.status}
                </span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      todayStatus.status === "Present"
                        ? "100%"
                        : todayStatus.status === "Late"
                        ? "60%"
                        : "20%",
                  }}
                />
              </div>

            </div>
          ) : (
            <div className="empty-state">
              <p>No attendance marked today</p>
            </div>
          )}

        </div>

        {/* ANNOUNCEMENTS */}
        <div className="panel">
          <h3>Announcements</h3>

          {announcements.length === 0 ? (
            <p>No announcements</p>
          ) : (
            announcements.map((a, i) => (
              <p key={i}>📢 {a.message}</p>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

export default UserDashboard;