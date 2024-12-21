import { useEffect, useState } from "react";
import ChatWindow from "../components/chat_window.jsx";
import GroupChatWindow from "../components/groupchat_window.jsx";

/* eslint-disable react/prop-types */
const Messages = ({ user }) => {
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [usersChats, setUsersChats] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [activatedChatId, setActivatedChatId] = useState("");
  const [chatType, setChatType] = useState("none");

  const [conversationUsers, setConversationUsers] = useState();
  const [usersConversations, setUsersConversations] = useState();
  const [allOtherUsers, setAllOtherUsers] = useState();

  const [oneOnOneData, setOneOnOneData] = useState();
  const [groupchatData, setGroupchatData] = useState();

  // [v] get all chats and groupchats by searching "" on that route
  // [v] left bar: search on top
  // [v] left bar: css the things like buttons
  // [v] right bar: by clicking on chats, send the thing to chat_window / groupchat_window
  // [v] "loading o"
  // [_] bug: fetches very slow: it's because two fetches go one after another. refactor api?
  // [_] bug: between different groupchats doesn't switch
  // [_] left bar: chats by recency under that (with date of latest message)
  // [_] right bar: chat css by classes, right leaning, left leaning and with profile pics, not usernames

  // refactoring backend:
  // what is currently happening:
  // 1) users_conversations are fetched, but they only include participants
  // 2) if user clicks on one-on-one chat: i fetches the chat object from the user and target user (2 non-simultaneous fetches)
  // 3) if user clicks on a groupchat: it fetches allUsers, then fetches groupchatObject based on id, then once again fetches the groupchatObject (4 fetches)

  // solution:
  // v serve allUsers at the same time
  // v serve all relevant conversation objects at the same time

  // refactor chats:
  // include conversation objects (with messages included) as state and show them immediately
  // do not update these on render of chat components, only when something happens
  // remove two fetches on switch to the messages tab

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
          setConversationUsers(data.conversations);
          setUsersConversations(data.conversationObjects);
          setAllOtherUsers(data.allOtherUsers);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    handleGetAllChats();
  }, [user, loggedInUser]);

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
      // filter allChats to find the correct one
      const correctConversationObject = usersConversations.find(
        (item) => item.id === chat.id
      );
      setOneOnOneData(correctConversationObject);
    } else if (chatType === "groupchat") {
      setChatType("groupchat");
      // filter allChats to find the correct one
      const correctConversationObject = usersConversations.find(
        (item) => item.id === chat.id
      );
      setGroupchatData(correctConversationObject);
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
                    <span key={item2.id}>{item2.user.username + " | "}</span>
                  ))}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chats_themselves">
        {chatType === "none" && (
          <div>
            <h2>↺ Loading... </h2>
          </div>
        )}
        {chatType === "one-on-one" && (
          <ChatWindow conversation={oneOnOneData} user={loggedInUser} />
        )}
        {chatType === "groupchat" && (
          <GroupChatWindow
            conversation={groupchatData}
            allUsers={allOtherUsers}
            user={loggedInUser}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
