import { useState, useEffect } from "react";
import API from "../../services/api";
import "./Attendance.css";

function Attendance() {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [time, setTime] = useState(new Date());

  const [todayAttendance, setTodayAttendance] = useState(null);

  // LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // LOAD DATA
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/my");
      const today = new Date().toISOString().split("T")[0];

      const record = res.data.find((a) => a.date === today);
      setTodayAttendance(record || null);
    } catch (err) {
      console.log(err);
    }
  };

  // CHECK IN
  const handleCheckIn = async () => {
    if (todayAttendance?.checkInTime) return;

    try {
      setLoading(true);
      setAction("in");

      await API.post("/attendance/mark");

      await fetchAttendance();
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  // CHECK OUT
  const handleCheckOut = async () => {
    if (!todayAttendance?.checkInTime || todayAttendance?.checkOutTime) return;

    try {
      setLoading(true);
      setAction("out");

      await API.post("/attendance/checkout");

      await fetchAttendance();
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-card">

        {/* HEADER */}
        <div className="header">
          <h1>Attendance Portal</h1>
          <p>Mark your daily attendance easily</p>
        </div>

        {/* CLOCK */}
        <div className="time-card">
          <h2>{time.toLocaleTimeString()}</h2>
          <span>{time.toDateString()}</span>
        </div>

        {/* STATUS BOX */}
        <div className="status-box">

          <div className="status-item">
            <h4>Office Hours</h4>
            <p>09:00 AM - 06:00 PM</p>
          </div>

          <div className="status-item">
            <h4>Today Status</h4>

            <div
              className={`status-bar ${
                todayAttendance?.status === "Present"
                  ? "status-present"
                  : todayAttendance?.status === "Late"
                  ? "status-late"
                  : "status-absent"
              }`}
            >
              {todayAttendance?.status || "Not Marked"}
            </div>

          </div>

        </div>

        {/* TIME DETAILS */}
        <div className="status-box">

          <div className="status-item">
            <h4>Check-In</h4>
            <p>
              {todayAttendance?.checkInTime
                ? new Date(todayAttendance.checkInTime).toLocaleTimeString()
                : "-"}
            </p>
          </div>

          <div className="status-item">
            <h4>Check-Out</h4>
            <p>
              {todayAttendance?.checkOutTime
                ? new Date(todayAttendance.checkOutTime).toLocaleTimeString()
                : "-"}
            </p>
          </div>

          <div className="status-item">
            <h4>Total Hours</h4>
            <p>{todayAttendance?.totalHours || "-"}</p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="button-grid">

          <button
            className="btn checkin-btn"
            onClick={handleCheckIn}
            disabled={loading || todayAttendance?.checkInTime}
          >
            {todayAttendance?.checkInTime
              ? "Already Checked In ✔"
              : loading && action === "in"
              ? "Checking In..."
              : "Check In"}
          </button>

          <button
            className="btn checkout-btn"
            onClick={handleCheckOut}
            disabled={
              loading ||
              !todayAttendance?.checkInTime ||
              todayAttendance?.checkOutTime
            }
          >
            {todayAttendance?.checkOutTime
              ? "Already Checked Out ✔"
              : loading && action === "out"
              ? "Checking Out..."
              : "Check Out"}
          </button>

        </div>

        <div className="footer-text">
          Work Smart • Stay Consistent 🚀
        </div>

      </div>
    </div>
  );
}

export default Attendance;