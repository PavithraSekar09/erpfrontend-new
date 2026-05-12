import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users/create", {
        name,
        email,
        department,
        salary
      });

      alert("Employee Added Successfully");
      navigate("/employees");

    } catch (error) {
      console.error(error);
      alert("Error adding employee");
    }
  };

  return (
    <div className="add-container">

      <div className="add-card">

        <h2>Add Employee</h2>
        <p className="sub-text">Fill employee details below</p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* DEPARTMENT DROPDOWN */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>

          {/* SALARY */}
          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />

          {/* SUBMIT */}
          <button type="submit">+ Add Employee</button>

        </form>

      </div>

    </div>
  );
}

export default AddEmployee;