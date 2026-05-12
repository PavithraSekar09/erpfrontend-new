import { useEffect, useState } from "react";
import API from "../../services/api";
import "./MyLeaves.css";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyLeaves = async () => {
    try {
      const res = await API.get("/leave/my");
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyLeaves();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <div className="leaves-page">

      <div className="leaves-header">
        <h2>My Leave Requests</h2>
        <p>Track all your leave applications</p>
      </div>

      {loading ? (
        <div className="loader-box">Loading your leaves...</div>
      ) : leaves.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Leaves Found</h3>
          <p>You haven’t applied for any leave yet.</p>

          <a href="/leave" className="apply-btn">
            Apply Leave
          </a>
        </div>
      ) : (
        <div className="card-grid">

          {leaves.map((l) => (
            <div key={l.id} className="leave-card">

              <div className="leave-top">
                <div className="reason">
                  {l.reason}
                </div>

                <span className={`status-pill ${getStatusClass(l.status)}`}>
                  {l.status}
                </span>
              </div>

              <div className="leave-footer">
                <small>Request ID: #{l.id}</small>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyLeaves;