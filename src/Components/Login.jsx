import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import users from "../data/users";
import { useAuth } from "../SharedLayouts/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const loginUser = (event) => {
    event.preventDefault();
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      setIsLoggedIn(true);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={loginUser}>
        <h1>Login</h1>
        <div className="login-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
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
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <button className="login-submit" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Login;
