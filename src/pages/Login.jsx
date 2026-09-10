import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';   // shared CSS for login/signup
import { motion } from "framer-motion";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("https://my-backend-pkcm.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || data);
        return;
      }
      login(data.token);
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
     
    <motion.div initial={{ opacity: 0, y: 20 }}  animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
      </div>
    </motion.div>
  );
}

export default Login;
