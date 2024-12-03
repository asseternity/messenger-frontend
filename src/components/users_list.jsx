import { useEffect, useState } from "react";
import ChatWindow from "./chat_window";

const UsersList = ({ user }) => {
  // save users in state
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [allUsers, setAllUsers] = useState([]);
  const [currentTargetUser, setCurrentTargetUser] = useState();
  const [currentConversation, setCurrentConversation] = useState();
  // get all users on load
  useEffect(() => {
    const handleGetAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const allOtherUsers = data.filter(
            (item) => item.username !== user.username
          );
          setAllUsers(allOtherUsers);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    if (user.token) {
      handleGetAllUsers();
    }
  }, [user]);
  // users should be buttons to chat with them
  // check whether there already is a one-v-one convo with that user (create only if there isn't)
  const handleStartChat = async (targetUser) => {
    try {
      const user1 = user.username;
      const user2 = targetUser.username;
      const participants = [user1, user2];

      const response = await fetch("http://localhost:3000/new-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ participant_usernames: participants }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.participants);
        setCurrentConversation(data);
        setCurrentTargetUser(targetUser);
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  const handleCreateGroupchat = async () => {
    // display UI to create a groupchat
  };

  return (
    // display all users
    // also display all groupchats that the user is a part of
    <div>
      <ul>
        {allUsers.map((item) => (
          <div key={item.id}>
            <li key={item.id}>{item.username}</li>
            <button onClick={() => handleStartChat(item)}>Chat</button>
          </div>
        ))}
      </ul>
      {currentConversation && (
        <div>
          <ChatWindow
            conversation={currentConversation}
            targetUser={currentTargetUser}
            user={loggedInUser}
          />
        </div>
      )}
      <div>
        <button onClick={() => handleCreateGroupchat()}>
          Start a groupchat!
        </button>
      </div>
    </div>
  );
};

export default UsersList;
