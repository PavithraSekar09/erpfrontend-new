import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (mail) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

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

      const response = await axios.post(
        "https://erp-backend-4-9jw8.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token || response.data;

      if (!token) {
        alert("Token not received");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      localStorage.setItem("role", role);
      localStorage.setItem("email", decoded.sub);

      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "EMPLOYEE") {
        window.location.href = "/user";
      } else {
        alert("Unknown Role");
      }

    } catch (error) {

      if (error.response && error.response.status === 401) {
        alert("Invalid Email or Password");

      } else if (error.response && error.response.status === 404) {
        alert("Email is not registered");

      } else {
        alert("Login Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo-circle">ERP</div>

        <h2>Welcome Back</h2>
        <p>Login to continue</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <p className="register">
          New user?
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;