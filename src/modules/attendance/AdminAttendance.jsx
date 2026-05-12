import { useEffect, useState } from "react";
import API from "../../services/api";
import "./AdminAttendance.css";

function AdminAttendance() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =========================
  // LOAD DATA
  // =========================
  const loadAttendance = async () => {
    try {
      const res = await API.get("/attendance/today"); // ✅ IMPORTANT FIX
      setList(res.data);
    } catch (error) {
      console.log("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();

    const interval = setInterval(() => {
      loadAttendance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // HELPERS
  // =========================
  const normalize = (s) => (s ? s.trim().toLowerCase() : "");

  const getDateOnly = (date) =>
    date ? date.toString().split("T")[0] : "";

  const formatTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // =========================
  // PRESENT GROUP LOGIC
  // =========================
  const isPresentGroup = (status) => {
    const s = normalize(status);
    return s === "present" || s === "late";
  };

  // =========================
  // FILTER LOGIC (FIXED IMPORTANT PART)
  // =========================
  const filteredByDate = list.filter((item) => {
    return (
      item.status?.toLowerCase() === "absent" ||
      getDateOnly(item.date) === selectedDate
    );
  });

  // =========================
  // STATUS FILTER
  // =========================
  const filteredList =
    filter === "ALL"
      ? filteredByDate
      : filter === "Present"
      ? filteredByDate.filter((item) => isPresentGroup(item.status))
      : filter === "Absent"
      ? filteredByDate.filter(
          (item) => normalize(item.status) === "absent"
        )
      : filteredByDate.filter(
          (item) => normalize(item.status) === normalize(filter)
        );

  // =========================
  // SUMMARY
  // =========================
  const total = filteredByDate.length;

  const present = filteredByDate.filter((x) =>
    isPresentGroup(x.status)
  ).length;

  const late = filteredByDate.filter(
    (x) => normalize(x.status) === "late"
  ).length;

  const absent = filteredByDate.filter(
    (x) => normalize(x.status) === "absent"
  ).length;

  return (
    <div className="attendance-admin-page">

      <h2>Admin Attendance Dashboard</h2>

      {/* DATE PICKER */}
      <div className="date-box">
        <label>Select Date: </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* SUMMARY */}
      <div className="attendance-summary">

        <div className="summary-card blue">
          Total <br /> {total}
        </div>

        <div className="summary-card green">
          Present <br /> {present}
        </div>

        <div className="summary-card orange">
          Late <br /> {late}
        </div>

        <div className="summary-card red">
          Absent <br /> {absent}
        </div>

      </div>

      {/* FILTER BUTTONS */}
      <div className="filter-buttons">

        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("Present")}>Present</button>
        <button onClick={() => setFilter("Late")}>Late</button>
        <button onClick={() => setFilter("Absent")}>Absent</button>

      </div>

      {/* TABLE */}
      <div className="attendance-table-box">

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="attendance-table">

            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredList.length > 0 ? (
                filteredList.map((a, index) => (
                  <tr key={index}>
                    <td>{a.user?.name || a.name || "-"}</td>
                    <td>{a.user?.email || a.email || "-"}</td>
                    <td>{a.date || selectedDate}</td>
                    <td>{formatTime(a.checkInTime)}</td>
                    <td>{formatTime(a.checkOutTime)}</td>
                    <td>{a.totalHours || "-"}</td>

                    <td>
                      <span
                        className={
                          normalize(a.status) === "present"
                            ? "status-present"
                            : normalize(a.status) === "late"
                            ? "status-late"
                            : "status-absent"
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No Attendance Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default AdminAttendance;