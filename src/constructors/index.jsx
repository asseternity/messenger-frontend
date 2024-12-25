import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";
import sl_logo from "/sl_logo.png";
import Messages from "./messages";
import Feed from "./feed";

/* eslint-disable react/prop-types */
const Index = ({ user }) => {
  const [profilePicUrl, setProfilePicUrl] = useState();
  const [feedOrMessages, setFeedOrMessages] = useState("feed");
  const [searchString, setSearchString] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        if (user.profilePicture) {
          setProfilePicUrl(
            `https://messenger-backend-production-a259.up.railway.app/uploads/${user.profilePicture}`
          );
        } else {
          setProfilePicUrl(defaultProfilePic);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfilePic();
  }, [user]);

  const handleTabClick = (section) => {
    if (section === "feed") {
      setFeedOrMessages("feed");
    } else {
      setFeedOrMessages("messages");
    }
  };

  const handleInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/search_username",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            targetUsername: searchString,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setFeedOrMessages("search");
        setLastSearch(searchString);
        setSearchString("");
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("error during fetch: ", err);
    }
  };

  return (
    <div className="container">
      <div className="top_bar">
        <div
          className={
            feedOrMessages === "feed"
              ? "username_bar username_bar_feed"
              : "username_bar username_bar_messages"
          }
        >
          <div>
            <img src={sl_logo} className="sl_logo" />
          </div>
          <div className="username_bar_center">
            <img src={profilePicUrl} className="profile_picture" />
            {user.username}
          </div>
          <div className="username_bar_right">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchString}
                onChange={handleInputChange}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
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
      {feedOrMessages === "feed" && <Feed user={user} />}
      {feedOrMessages === "messages" && <Messages user={user} />}
      {feedOrMessages === "search" && (
        <div>
          {searchResults.length > 0 ? (
            <div className="search_results">
              <h2>Search results for {lastSearch}</h2>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <img
                      src={`https://messenger-backend-production-a259.up.railway.app/uploads/${
                        result.profilePicture || "default.png"
                      }`}
                      alt={`${result.username}'s profile`}
                      className="search_result_pic"
                      onError={(e) => (e.target.src = defaultProfilePic)} // Handle broken images
                    />
                    <p>{result.username}</p>
                  </li>
                ))}
              </ul>
              <div className="search_results_filler"></div>
            </div>
          ) : (
            <div>No results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;

// [v] index page:
// // [v] make home / messages into buttons with functions
// // [v] tie the whole thing to main.jsx and grab props from it
// // [v] populate username bar with a profile pic (or a default one)
// // [v] logo in upper left that doubles as a favicon
// [v] create a messages sub-component:
// // [v] add a search through messages
// // [v] rework users_list, chat_window and groupchat_window

// [v] create a feed sub-component that will fetch the user's feed and handle creating a new post:
// // [v] handle comments

// [v] top right: search users field
// // [v] allow for search among all users (also needs to be a route on the api)
// // [_] to the side of user: profile, chat (leads to postNewConversation - one on one chat)

// [_] profile component:
// // [_] open profiles through the search tab
// // [_] see your profile
// // [_] editing mode for your profile
// // [_] same layout but other's profile
// // [_] follow / message buttons
// // [_] profile posts: posts of that person under their profile

// [_] top left - button returns to the main page

// [_] update css and functionality if needed:
// // [_] login screen
// // [_] registration
// // [_] groupchat creation