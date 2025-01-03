import { useState } from "react";
import { Link } from "react-router-dom";
import Index from "./index";

/* eslint-disable react/prop-types */
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [targetProfileUser, setTargetProfileUser] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/log-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error during login: ", err);
    }
  };

  const updateUser = (newUser, newTargetUser) => {
    setUser(newUser);
    setTargetProfileUser(newTargetUser);
  };

  return (
    <div className="root">
      {!user && (
        <div className="login_container">
          <div className="login_title_container">
            <h3 className="login_title">Soleira&apos;s</h3>
            <h3 className="login_title">Lounge</h3>
          </div>
          <div className="login_form_card">
            <form onSubmit={handleSubmit}>
              <div className="login_form">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="login_form">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button className="login_button" type="submit">
                Login
              </button>
            </form>
            <p>Don&apos;t have an account?</p>
            <p>
              Register <Link to="/registration">here</Link>.
            </p>
          </div>
        </div>
      )}
      {user && (
        <Index
          user={user}
          targetProfileUser={targetProfileUser}
          updateUser={updateUser}
        />
      )}
    </div>
  );
};

export default Login;
