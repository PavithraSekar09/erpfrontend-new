import { useEffect, useState } from "react";
import API from "../../services/api";
import "./LeaveList.css";

function LeaveList() {
  const [leaves, setLeaves] = useState([]);

  const role = (localStorage.getItem("role") || "").toUpperCase();

  const loadLeaves = () => {
    if (role === "ADMIN") {
      API.get("/leave")
        .then((res) => setLeaves(res.data))
        .catch((err) => console.log(err));
    } else {
      API.get("/leave/my")
        .then((res) => setLeaves(res.data))
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const approve = async (id) => {
    await API.put(`/leave/approve/${id}`);
    loadLeaves();
  };

  const reject = async (id) => {
    await API.put(`/leave/reject/${id}`);
    loadLeaves();
  };

  return (
    <div className="leave-container">
      <h2 className="title">Leave Requests</h2>

      <div className="leave-grid">
        {leaves.map((l) => (
          <div key={l.id} className="leave-card">
            
            <div className="leave-top">
              <h3>{l.employeeEmail}</h3>
              <span className={`status ${l.status?.toLowerCase()}`}>
                {l.status}
              </span>
            </div>

            <p><b>Reason:</b> {l.reason}</p>

            <div className="btn-group">
              {role === "ADMIN" && (
                <>
                  <button className="approve" onClick={() => approve(l.id)}>
                    Approve
                  </button>
                  <button className="reject" onClick={() => reject(l.id)}>
                    Reject
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveList;