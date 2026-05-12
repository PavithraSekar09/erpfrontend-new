import { useEffect, useState } from "react";
import API from "../../services/api";
import "./MyProfile.css";

function MyProfile() {
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));

    API.get("/attendance/my")
      .then((res) => setAttendance(res.data))
      .catch((err) => console.log(err));
  }, []);

  const saveProfile = () => {
    API.put("/users/profile", user)
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2>{user.name || "User Profile"}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="profile-grid">
          <Info label="Role" value={user.role} />
          <Info label="Department" value={user.department} />
          <Info label="Phone" value={user.phone} />
          <Info label="Address" value={user.address} />
          <Info label="Employee ID" value={user.id} />
        </div>

        {/* BUTTON */}
        {!editMode && (
          <button className="btn primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}

        {/* EDIT FORM */}
        {editMode && (
          <div className="edit-form">
            <input
              placeholder="Name"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />

            <input
              placeholder="Department"
              value={user.department || ""}
              onChange={(e) =>
                setUser({ ...user, department: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />

            <input
              placeholder="Address"
              value={user.address || ""}
              onChange={(e) =>
                setUser({ ...user, address: e.target.value })
              }
            />

            <div className="btn-group">
              <button className="btn success" onClick={saveProfile}>
                Save
              </button>
              <button
                className="btn danger"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        <div className="attendance-box">
          <h3>Today's Attendance</h3>

          <div className="attendance-grid">
            <div>
              <p>Status</p>
              <span className={`badge ${attendance[0]?.status}`}>
                {attendance[0]?.status || "Not Marked"}
              </span>
            </div>

            <div>
              <p>Check In</p>
              <strong>
                {attendance[0]?.checkInTime
                  ? new Date(
                      attendance[0].checkInTime
                    ).toLocaleTimeString()
                  : "--"}
              </strong>
            </div>

            <div>
              <p>Check Out</p>
              <strong>
                {attendance[0]?.checkOutTime
                  ? new Date(
                      attendance[0].checkOutTime
                    ).toLocaleTimeString()
                  : "--"}
              </strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyProfile;

function Info({ label, value }) {
  return (
    <div className="info-card">
      <p>{label}</p>
      <strong>{value || "Not Updated"}</strong>
    </div>
  );
}