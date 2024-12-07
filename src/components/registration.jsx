import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubbleWrapper from "./styled/wrapper";
import PhoneButton from "./styled/styledButton";
import CenteredContainer from "./styled/centeringWrapper";

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
    }
  };

  return (
    <CenteredContainer>
      <MessageBubbleWrapper>
        <h2>Register</h2>
        {error && <div>{error}</div>}
        {success && <div>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              required
            />
          </div>
          <PhoneButton type="submit">Register</PhoneButton>
        </form>
      </MessageBubbleWrapper>
    </CenteredContainer>
  );
};

export default Registration;
