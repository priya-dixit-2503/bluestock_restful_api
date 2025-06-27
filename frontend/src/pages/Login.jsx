import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      });

      localStorage.setItem('access_token', res.data.access);
      onLogin(); // Tell parent we're logged in
      navigate("/secure"); // Go to secure page
    } catch (err) {
      console.error('Login failed:', err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} 
      className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        <button type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
