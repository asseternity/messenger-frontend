import { useEffect, useState } from "react";
import ChatWindow from "../components/chat_window.jsx";
import GroupChatWindow from "../components/groupchat_window.jsx";

/* eslint-disable react/prop-types */
const Messages = ({ user }) => {
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [usersChats, setUsersChats] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [activatedChatId, setActivatedChatId] = useState("");
  const [chatType, setChatType] = useState("");
  const [chat, setChat] = useState("");
  // [v] get all chats and groupchats by searching "" on that route
  // [v] left bar: search on top
  // [v] left bar: css the things like buttons
  // [_] left bar: chats by recency under that (with date of latest message)
  // [_] right bar: by clicking on chats, send the thing to chat_window / groupchat_window
  // [_] right bar: chat css by classes, right leaning, left leaning and with profile pics, not usernames

  useEffect(() => {
    const handleGetAllChats = async () => {
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/users_conversations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              myUserId: user.userId,
              searchString: "",
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsersChats(data.conversations);
          console.log(data.conversations);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    handleGetAllChats();
  }, [loggedInUser]);

  const handleInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const searchParticipants = (usersChatArray, searchTerm) => {
    return usersChatArray.filter((conversation) =>
      conversation.participants.some((participant) =>
        participant.user.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredChats = searchParticipants(usersChats, searchString);

  const handleChatButton = async (chat, chatType) => {
    setActivatedChatId(chat.id);
    if (chatType === "one-on-one") {
      setChatType("one-on-one");
      // extract the target username
      const targetUsername = chat.participants.map(
        (item) => item.user.username !== loggedInUser.username
      );
      setChat(targetUsername);
    } else if (chatType === "groupchat") {
      setChatType("groupchat");

      // fetch the conversation object

      // fetch allUsers array
    }
  };

  return (
    <div className="messages_container">
      <div className="chats_search_&_list">
        <div className="search_form">
          <form>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchString}
              onChange={handleInputChange}
            />
          </form>
        </div>
        <div className="search_results">
          {filteredChats.map((item) => (
            <div key={item.id}>
              {item.participants.length === 2 ? (
                <button
                  className={
                    activatedChatId === item.id
                      ? "chat_button chat_button_activated"
                      : "chat_button chat_button_inactivated"
                  }
                  onClick={() => handleChatButton(item, "one-on-one")}
                >
                  {item.participants.map((item2) => (
                    <span key={item2.id}>
                      {item2.user.username === loggedInUser.username
                        ? ""
                        : item2.user.username}
                    </span>
                  ))}
                </button>
              ) : (
                <button
                  className={
                    activatedChatId === item.id
                      ? "chat_button chat_button_activated"
                      : "chat_button chat_button_inactivated"
                  }
                  onClick={() => handleChatButton(item, "groupchat")}
                >
                  <span>Groupchat: </span>
                  {item.participants.map((item2) => (
                    <span key={item2.id}>
                      {item2.user.username === loggedInUser.username
                        ? ""
                        : item2.user.username + " | "}
                    </span>
                  ))}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chats_themselves">
        {chatType === "" && ""}
        {chatType === "one-on-one" && (
          <ChatWindow user={loggedInUser} targetUsername={chat} />
        )}
        {chatType === "groupchat" && ""}
      </div>
    </div>
  );
};

export default Messages;
