import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/chat_window.jsx";
import GroupChatWindow from "../components/groupchat_window.jsx";
import GroupChatCreator from "../components/group_chat_creator.jsx";

/* eslint-disable react/prop-types */
const Messages = ({ user, instantConversation }) => {
  const navigate = useNavigate();

  const [searchString, setSearchString] = useState("");
  const [activatedChatId, setActivatedChatId] = useState("");
  const [chatType, setChatType] = useState("none");

  const [usersConversations, setUsersConversations] = useState();
  const [allOtherUsers, setAllOtherUsers] = useState();

  const [oneOnOneData, setOneOnOneData] = useState();
  const [groupchatData, setGroupchatData] = useState();

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
              myUserId: user.id,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsersConversations(data.conversationObjects);
          setAllOtherUsers(data.allOtherUsers);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    handleGetAllChats();
  }, [user, activatedChatId]);

  useEffect(() => {
    const handleInstantConversation = async () => {
      // fetch the one on one route
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/new-chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              participant_usernames: [
                instantConversation.username,
                user.username,
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setChatType("one-on-one");
          setOneOnOneData({ ...data });
        } else {
          console.error("Failed to fetch conversation");
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };
    // if instantConversation is not ""
    if (instantConversation !== "") {
      handleInstantConversation();
    }
    //
  }, []);

  const handleInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const searchParticipants = (usersChatArray, searchTerm) => {
    return usersChatArray.filter(
      (conversation) =>
        // Check if there are participants matching the search term
        conversation.participants.some((participant) =>
          participant.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) &&
        // Also, ensure that there are messages in the conversation (message.length > 0)
        conversation.message.length > 0
    );
  };

  const filteredChats = usersConversations
    ? searchParticipants(usersConversations, searchString).sort((a, b) => {
        const aLastMessage = a.message.length
          ? new Date(a.message[a.message.length - 1].createdAt)
          : new Date(0); // Handle empty messages (use epoch as fallback)
        const bLastMessage = b.message.length
          ? new Date(b.message[b.message.length - 1].createdAt)
          : new Date(0);
        return bLastMessage - aLastMessage; // Sort descending (newest first)
      })
    : [];

  const handleChatButton = async (chat, chatType) => {
    setActivatedChatId((prevId) => {
      // Update activated chat only if it's different to avoid unnecessary re-renders
      if (prevId !== chat.id) {
        return chat.id;
      }
      return prevId;
    });
    if (chatType === "one-on-one") {
      setChatType("one-on-one");
      // filter allChats to find the correct one
      const correctConversationObject = usersConversations.find(
        (item) => item.id === chat.id
      );
      setOneOnOneData({ ...correctConversationObject });
    } else if (chatType === "groupchat") {
      setChatType("groupchat");
      // filter allChats to find the correct one
      const correctConversationObject = usersConversations.find(
        (item) => item.id === chat.id
      );
      setGroupchatData({ ...correctConversationObject });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClickCreateGroupchat = () => {
    setChatType("creator");
  };

  return (
    <div className="messages_container">
      <div className="chats_list">
        <div className="search_form">
          <form className="chats_search_form">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchString}
              onChange={handleInputChange}
            />
          </form>
          <button
            className="delete_post not_rounded_smaller"
            onClick={handleClickCreateGroupchat}
          >
            + Create a groupchat
          </button>
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
                  <div>
                    {item.participants.map((item2) => (
                      <span key={item2.id}>
                        {item2.user.username === user.username
                          ? ""
                          : item2.user.username}
                      </span>
                    ))}
                  </div>
                  <span className="last_message">
                    {"🕑 " +
                      formatDate(
                        item.message[item.message.length - 1].createdAt
                      )}
                  </span>
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
                  <div>
                    <span>Groupchat: </span>
                    {item.participants.map((item2) => (
                      <span key={item2.id}>{item2.user.username + " | "}</span>
                    ))}
                  </div>
                  <span className="last_message">
                    {"🕑 " +
                      formatDate(
                        item.message[item.message.length - 1].createdAt
                      )}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {!usersConversations && (
        <div className="loading_bar">
          <h2>↺ Loading... </h2>
        </div>
      )}
      {chatType === "one-on-one" && (
        <ChatWindow conversation={oneOnOneData} user={user} />
      )}
      {chatType === "groupchat" && (
        <GroupChatWindow
          conversation={groupchatData}
          allUsers={allOtherUsers}
          user={user}
        />
      )}
      {chatType === "creator" && (
        <GroupChatCreator allUsers={allOtherUsers} user={user} />
      )}
    </div>
  );
};

export default Messages;

// [v] get all chats and groupchats by searching "" on that route
// [v] left bar: search on top
// [v] left bar: css the things like buttons
// [v] right bar: by clicking on chats, send the thing to chat_window / groupchat_window
// [v] "loading o"
// [v] bug: between different chats/groupchats doesn't switch
// [v] bug: doesn't refetch EVER after initial switch to messages tab
// [v] bug: fetches very slow: it's because two fetches go one after another. refactor api?
// [v] combine conversationUser and conversationObject into one functionality
// [v] remove the searching from users_conversations, it just slows down the fetch
// [v] left bar: chats by recency under that (with date of latest message)
// [v] right bar: chat css by classes, right leaning, left leaning and with profile pics, not usernames

// refactoring backend:
// what is currently happening:
// 1) users_conversations are fetched, but they only include participants
// 2) if user clicks on one-on-one chat: i fetches the chat object from the user and target user (2 non-simultaneous fetches)
// 3) if user clicks on a groupchat: it fetches allUsers, then fetches groupchatObject based on id, then once again fetches the groupchatObject (4 fetches)

// solution:
// v serve allUsers at the same time
// v serve all relevant conversation objects at the same time

// refactor chats:
// v include conversation objects (with messages included) as state and show them immediately
// v do not update these on render of chat components, only when something happens
// v remove two fetches on switch to the messages tab

// css messages to do:
// v manage overflow without a scrollbar on the right at all times? or restyling the scrollbar?
// v fix and beautify keyboard
// v loading in the middle of everything
// v sizes / responsive for mobile
