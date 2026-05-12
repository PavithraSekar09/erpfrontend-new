import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import "./EmployeeList.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/users/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      alert("Employee Deleted");
    } catch (error) {
      console.error(error);
      alert("Error deleting employee");
    }
  };

  return (
    <div className="emp-container">

      {/* HEADER */}
      <div className="emp-header">
        <h2>Employee Management</h2>

        <Link to="/add-employee">
          <button className="add-btn">+ Add Employee</button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="emp-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>

                <td className="name-cell">{emp.name}</td>
                <td>{emp.email}</td>

                <td>
                  <span className="dept-badge">
                    {emp.department}
                  </span>
                </td>

                <td className="salary">₹ {emp.salary}</td>

                <td>
                  <div className="action-btns">

                    <Link to={`/edit-employee/${emp.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default EmployeeList;