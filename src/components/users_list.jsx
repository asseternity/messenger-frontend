import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./chat_window";
import GroupChatWindow from "./groupchat_window";
import SplitLayout from "./styled/split_layout";
import PhoneButton from "./styled/styledButton";
import PhoneButton2 from "./styled/styledButton2";

const UsersList = ({ user }) => {
  // save users in state
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroupChats, setAllGroupChats] = useState([]);
  const [currentTargetUser, setCurrentTargetUser] = useState();
  const [currentConversation, setCurrentConversation] = useState();
  const [currentConversationType, setCurrentConversationType] = useState();
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
  }, [user, currentConversationType]);

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
          setAllGroupChats(dataGroupChatsWithUsernames);
        }
      } catch (err) {
        console.log("Error during fetch: ", err);
      }
    };

    handleGetGroupChats();
  }, [user, allUsers, currentConversationType]);
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
        setCurrentConversation(data);
        setCurrentTargetUser(targetUser);
        setCurrentConversationType("one-on-one");
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
            username: user ? user.username : "you",
          };
        }),
      };
      return newChat;
    });
  };

  const handleGoToGroupChat = async (groupchatObject) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${groupchatObject.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching group chat: ${response.statusText}`);
      }

      if (response.ok) {
        const data = await response.json();
        setCurrentConversation(data);
        setCurrentConversationType("groupchat");
      }
    } catch (error) {
      console.error("Failed to fetch group chat data:", error);
    }
  };

  return (
    // display all users
    // also display all groupchats that the user is a part of
    <SplitLayout>
      <div className="left_nav">
        <ul>
          {allUsers.map((item) => (
            <div key={item.id}>
              <li key={item.id}>
                <button
                  className="list_button"
                  onClick={() => handleStartChat(item)}
                >
                  {item.username}
                </button>
              </li>
            </div>
          ))}
        </ul>
        <ul>
          {allGroupChats.map((item) => (
            <div key={item.id}>
              <li key={item.id}>
                <button
                  className="list_button"
                  onClick={() => handleGoToGroupChat(item)}
                >
                  {item.participants.map((user) => user.username).join(", ")}
                </button>
              </li>
            </div>
          ))}
        </ul>
        <div>
          <PhoneButton2
            className="start_groupchat_button"
            onClick={() => handleCreateGroupchat()}
          >
            Start a groupchat!
          </PhoneButton2>
        </div>
      </div>
      <div className="right_chat">
        {currentConversationType === "one-on-one" && (
          <div className="inside_right_chat">
            <ChatWindow
              conversation={currentConversation}
              targetUser={currentTargetUser}
              user={loggedInUser}
            />
          </div>
        )}
        {currentConversationType === "groupchat" && (
          <div className="inside_right_chat">
            <GroupChatWindow
              key={currentConversation?.id}
              conversation={currentConversation}
              allUsers={allUsers}
              user={loggedInUser}
            />
          </div>
        )}
      </div>
    </SplitLayout>
  );
};

export default UsersList;
