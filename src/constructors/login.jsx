import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Index from "./index";

/* eslint-disable react/prop-types */
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [targetProfileUser, setTargetProfileUser] = useState();
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Automatically log in the user if the token is present
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/auto-login",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setShowLoginScreen(true);
        }
      } catch (err) {
        console.error("Error during auto-login: ", err);
      }
    };

    const token = localStorage.getItem("jwtToken");
    if (token) {
      autoLogin();
    } else {
      setShowLoginScreen(true);
    }
  }, []);

  // Manual login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
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
        localStorage.setItem("jwtToken", data.token);
        setUser(data);
      } else if (response.status === 401) {
        setErrorMessage("Incorrect username or password."); // Set error message for 401
      } else {
        setErrorMessage("An error occurred. Please try again."); // General error message
      }
    } catch (err) {
      console.error("Error during login: ", err);
      setErrorMessage("An error occurred. Please try again."); // Handle network errors
    }
  };

  const updateUser = (newUser, newTargetUser) => {
    if (newUser === null) {
      localStorage.removeItem("jwtToken");
      setShowLoginScreen(true);
      setUser(null);
    } else {
      setUser(newUser);
      setTargetProfileUser(newTargetUser);
    }
  };

  // guest login
  const handleGuest = async () => {
    setErrorMessage("");
    const token = localStorage.getItem("jwtToken");
    if (token) {
      localStorage.removeItem("jwtToken");
    } else
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/log-in",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username: "Guest", password: "123" }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setErrorMessage("An error occurred. Please try again."); // General error message
        }
      } catch (err) {
        console.error("Error during login: ", err);
        setErrorMessage("An error occurred. Please try again."); // Handle network errors
      }
  };

  return (
    <div className="root">
      {!user && showLoginScreen && (
        <div className="login_container">
          <div className="login_title_container">
            <h3 className="login_title">Soleira&apos;s</h3>
            <h3 className="login_title">Lounge</h3>
          </div>
          <div className="login_form_card">
            {errorMessage && (
              <p className="error_message">{errorMessage}</p> // Display the error message
            )}
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
              Register <Link to="/registration">here</Link> or try{" "}
              <Link onClick={handleGuest}>Guest</Link> access.
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
