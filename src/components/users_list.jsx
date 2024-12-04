import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./chat_window";

const UsersList = ({ user }) => {
  // save users in state
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroupChats, setAllGroupChats] = useState([]);
  const [currentTargetUser, setCurrentTargetUser] = useState();
  const [currentConversation, setCurrentConversation] = useState();
  const navigate = useNavigate();
  // Get all users on load
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

  // Combine group chats with user details after allUsers is updated
  useEffect(() => {
    const handleGetGroupChats = async () => {
      try {
        const responseGroupChats = await fetch(
          "http://localhost:3000/group-chats",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({ userId: user.userId }),
          }
        );
        if (responseGroupChats.ok) {
          const dataGroupChats = await responseGroupChats.json();
          const dataGroupChatsWithUsernames = combineGroupChatsWithUsernames(
            dataGroupChats,
            allUsers
          );
          console.log(dataGroupChatsWithUsernames);
          setAllGroupChats(dataGroupChatsWithUsernames);
        }
      } catch (err) {
        console.log("Error during fetch: ", err);
      }
    };

    handleGetGroupChats();
  }, [allUsers]);
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

  const handleCreateGroupchat = () => {
    navigate("/groupchat", { state: { user: user, allUsers: allUsers } }); // Navigate to the group chat creation page
  };

  const combineGroupChatsWithUsernames = (groupchats, allUsers) => {
    return groupchats.map((chat) => {
      // Create a new object for each groupchat
      let newChat = {
        ...chat, // Spread existing chat properties
        participants: chat.participants.map((participant) => {
          // Find the user corresponding to the userId in the allUsers array
          const user = allUsers.find((u) => u.id === participant.userId);
          // Add the username to the participant object
          return {
            ...participant, // spread existing participant properties
            username: user ? user.username : "you", // add username (or null if not found)
          };
        }),
      };
      return newChat;
    });
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
      <ul>
        {allGroupChats.map((item) => (
          <div key={item.id}>
            <li key={item.id}>
              {item.participants.map((user) => user.username).join(", ")}
            </li>
            <button>Chat</button>
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
