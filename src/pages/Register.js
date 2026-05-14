import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (mail) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Enter Email and Password");
      return;
    }

    if (!validateEmail(email)) {
      alert("Enter valid Email ID");
      return;
    }

    try {
      setLoading(true);

      await axios.post("https://erp-backend-4-9jw8.onrender.com/api/auth/register", {
        email,
        password,
      });

      alert("Registered Successfully ✔");
      navigate("/login");

    } catch (error) {

      if (
        error.response &&
        error.response.data &&
        error.response.data.toLowerCase().includes("already")
      ) {
        alert("Email already registered");
      } else {
        alert("Registration Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="logo-circle">ERP</div>

        <h1>Create Account</h1>
        <p>Enter email and set password</p>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="register-btn"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="bottom-text">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;