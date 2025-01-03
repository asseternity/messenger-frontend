import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.cpassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            cpassword: formData.cpassword,
          }),
        }
      );
      if (response.ok) {
        setSuccess("Registration successful! Redirecting...");
        setFormData({
          username: "",
          email: "",
          password: "",
          cpassword: "",
        });
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.log(err);
    }
  };

  return (
    <div className="login_container">
      <div className="login_title_container">
        <h3 className="login_title">Soleira&apos;s</h3>
        <h3 className="login_title">Lounge</h3>
      </div>
      <div className="login_form_card">
        {error && <div>{error}</div>}
        {success && <div>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="login_form">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="login_form">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="login_form">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="login_form">
            <input
              type="password"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <button className="login_button" type="submit">
            Register
          </button>
          <p>
            Go <Link to="/">back</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
