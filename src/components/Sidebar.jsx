import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <h2 className="logo">ERP SYSTEM</h2>

      <ul className="menu">

        {/* DASHBOARD */}
        <li>
          <Link to={role === "admin" ? "/admin" : "/user"}>
            Dashboard
          </Link>
        </li>

     {role === "admin" && (
  <>
    <li><Link to="/employees">Employees</Link></li>

    <li><Link to="/add-employee">Add Employee</Link></li>

    <li><Link to="/leave-list">Leave Requests</Link></li>

    <li><Link to="/admin-attendance">Attendance</Link></li>

    <li><Link to="/admin-finance">Finance</Link></li>

    <li><Link to="/sales">Sales</Link></li>
    <li><Link to="/product">Product</Link></li>
  </>
)}
        {/* EMPLOYEE MENU */}
       {role === "employee" && (
  <>
    
    <li><Link to="/attendance">Attendance</Link></li>
    <li><Link to="/leave">Apply Leave</Link></li>
    <li><Link to="/my-leaves">My Leaves</Link></li>
    <li><Link to="/my-profile">My Profile</Link></li>
  </>
)}

      </ul>

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Sidebar;