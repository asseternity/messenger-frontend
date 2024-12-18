import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Messages from "./messages";
import Feed from "./feed";

/* eslint-disable react/prop-types */
const Index = ({ user }) => {
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [feedOrMessages, setFeedOrMessages] = useState("feed");

  const handleTabClick = (section) => {
    if (section === "feed") {
      setFeedOrMessages("feed");
    } else {
      setFeedOrMessages("messages");
    }
  };

  return (
    <div className="container">
      <div className="top_bar">
        <div className="username_bar">{user.username}</div>
        <div className="tabs_bar">
          <button
            className={
              feedOrMessages === "feed"
                ? "tab_bar feedActive"
                : "tab_bar feedInactive"
            }
            onClick={() => handleTabClick("feed")}
          >
            Home
          </button>
          <button
            className={
              feedOrMessages === "messages"
                ? "tab_bar messagesActive"
                : "tab_bar messagesInactive"
            }
            onClick={() => handleTabClick("messages")}
          >
            Messages
          </button>
        </div>
      </div>
      <div className="main_container">
        {feedOrMessages === "feed" && <Feed />}
        {feedOrMessages === "messages" && <Messages />}
      </div>
    </div>
  );
};

export default Index;

// [_] index page:
// // [_] make home / messages into buttons with functions
// // [_] tie the whole thing to main.jsx and grab props from it
// // [_] populate username bar

// [_] profile component:
// // [_] see your profile
// // [_] editing mode for your profile
// // [_] same layout but other's profile
// // [_] follow / message buttons

// [_] create a feed sub-component that will fetch the user's feed and handle creating a new post:
// // [_] handle comments

// [_] create a messages sub-component:
// // [_] add a search through messages
// // [_] rework users_list, chat_window and groupchat_window

// [_] update registration
// [_] update groupchat creation
