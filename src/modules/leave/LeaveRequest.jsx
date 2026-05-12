import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./LeaveRequest.css";

function LeaveRequest() {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const applyLeave = async () => {
    if (!reason.trim()) {
      setMessage({ type: "error", text: "Reason is required" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/leave", { reason });

      setMessage({ type: "success", text: "Leave request submitted successfully" });

      setReason("");

      setTimeout(() => {
        navigate("/my-leaves");
      }, 1200);

    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-wrapper">

      <div className="leave-box">

        <div className="leave-top">
          <h2>Leave Application</h2>
          <p>Submit your request for approval</p>
        </div>

        <div className="input-section">

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your reason clearly..."
            maxLength={300}
          />

          <div className="meta-row">
            <span className={reason.length > 280 ? "warn" : ""}>
              {reason.length}/300
            </span>
          </div>

        </div>

        {message.text && (
          <div className={`toast ${message.type}`}>
            {message.text}
          </div>
        )}

        <button
          className={`btn ${loading ? "loading" : ""}`}
          onClick={applyLeave}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Send Request"}
        </button>

      </div>

    </div>
  );
}

export default LeaveRequest;