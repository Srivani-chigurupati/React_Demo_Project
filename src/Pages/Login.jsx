import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getUsers from "../services/UserService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const users = await getUsers();
      const user = users.find(
        (candidate) =>
          typeof candidate.email === "string" &&
          candidate.email.toLowerCase() === email.trim().toLowerCase() &&
          candidate.password === password,
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      setIsLoggedIn(true);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the login service.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page container py-5">
      <form className="login-form card p-4 shadow-sm" onSubmit={loginUser}>
        <h1 className="h2">Login</h1>
        <div className="login-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="form-control"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="login-password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="login-password"
              className="form-control"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && (
          <p className="login-error alert alert-danger py-2" role="alert">
            {error}
          </p>
        )}
        <button className="login-submit btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Submit"}
        </button>
      </form>
    </main>
  );
};

export default Login;
