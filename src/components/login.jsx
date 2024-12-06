import { useState } from "react";
import UsersList from "./users_list";
import { Link } from "react-router-dom";
import MessageBubbleWrapper from "./styled/wrapper";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
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
    <div>
      {!user && (
        <MessageBubbleWrapper>
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
            <button type="submit">Login</button>
          </form>
        </MessageBubbleWrapper>
      )}
      {user && (
        <div>
          {/* <button onClick={() => console.log(user.token)}>
            Console.log token
          </button> */}
          <p>Current user: {user.username}</p>
          <div>
            <UsersList user={user} />
          </div>
        </div>
      )}
      <p>
        Don&apos;t have an account? Register{" "}
        <Link to="/registration">here</Link>.
      </p>
    </div>
  );
};

export default Login;
