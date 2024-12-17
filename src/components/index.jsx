import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const Index = ({ user }) => {
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [feedOrMessages, setFeedOrMessages] = useState("feed");

  return (
    <div>
      <div className="top_bar">
        <div className="username_bar"></div>
        <div className="tabs_bar">
          <div className="tab_bar feed">Home</div>
          <div className="tab_bar messages">Messages</div>
        </div>
      </div>
      <div className="main_container">
        {feedOrMessages === "feed" && <div className="feed_container"></div>}
        {feedOrMessages === "messages" && (
          <div className="messages_container"></div>
        )}
      </div>
    </div>
  );
};

export default Index;
