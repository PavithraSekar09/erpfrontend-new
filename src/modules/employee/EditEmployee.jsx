import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EditEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      const emp = res.data;

      setName(emp.name || "");
      setEmail(emp.email || "");
      setDepartment(emp.department || "");
      setSalary(emp.salary || "");

    } catch (error) {
      console.error(error);
      alert("Error loading employee");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/users/${id}`, {
        name,
        email,
        department,
        salary
      });

      alert("Employee Updated");
      navigate("/employees");

    } catch (error) {
      console.error(error);
      alert("Error updating employee");
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>

      <form onSubmit={handleUpdate}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <br /><br />

        <button type="submit">Update</button>

      </form>
    </div>
  );
}

export default EditEmployee;