import { useState } from "react";
import UsersList from "./users_list";
import { Link } from "react-router-dom";
import MessageBubbleWrapper from "./styled/wrapper";
import PhoneButton from "./styled/styledButton";
import CenteredContainer from "./styled/centeringWrapper";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

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
        console.log(data);
        setUser(data);
      }
    } catch (err) {
      console.error("Error during login: ", err);
    }
  };

  return (
    <CenteredContainer>
      {!user && (
        <CenteredContainer>
          <MessageBubbleWrapper>
            <h3>Fullstack Messenger</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <PhoneButton type="submit">Login</PhoneButton>
            </form>
            <p>Don&apos;t have an account?</p>
            <p>
              Register <Link to="/registration">here</Link>.
            </p>
          </MessageBubbleWrapper>
        </CenteredContainer>
      )}
      {user && <UsersList user={user} />}
    </CenteredContainer>
  );
};

export default Login;
