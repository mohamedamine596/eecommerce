import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../services/user.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUser from "../../context/UserContext/UserContext.jsx";
import { showSuccessToast, showErrorToast } from "../../utiles/Toast/toast.js";
import Loader from "../Loader/Loader.jsx";
import GoogleAuthButton from "../GoogleAuthButton/GoogleAuthButton.jsx";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  // const [loginpage, setLoginPage] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await loginUser({ email, password });
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
      showSuccessToast(`Welcome ${user.username}`);
    } catch (error) {
      console.log(error);
      showErrorToast(`${error?.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    showSuccessToast(`Welcome ${user.username}!`);
    localStorage.setItem("user", JSON.stringify(user));
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
    setUser(user);
  };

  const handleGoogleError = () => {
    showErrorToast("Login failed! Please try again");
  };

  return (
    <>
      <Loader isVisible={loading} message="signing in.." />
      <form className="form" onSubmit={handleLogin}>
        <h1
          style={{
            fontSize: "22px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Login your account
        </h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <span
          onClick={() => navigate("/forget-password")}
          className="forget-message"
        >
          Forget password
        </span>
        <p>
          Don't have a Account?{" "}
          <Link className="registerPage" to="/register">
            Create Account
          </Link>
        </p>
        <button type="submit" className="login-submit-btn" disabled={loading}>
          Login
        </button>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <h2 className="OR">Or</h2>
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </>
        )}
      </form>
    </>
  );
}
export default Login;
