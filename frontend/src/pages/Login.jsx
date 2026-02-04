import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { FiBriefcase } from "react-icons/fi";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Top Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiBriefcase size={28} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your credentials to access your account
        </p>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Role
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={formData.role === "jobseeker"}
                onChange={handleChange}
                className="accent-blue-600"
              />
              Job Seeker
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={formData.role === "recruiter"}
                onChange={handleChange}
                className="accent-blue-600"
              />
              Recruiter
            </label>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p
          onClick={() => navigate("/signup")}
          className="text-sm text-center text-gray-600 mt-4"
        >
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer font-medium">
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
