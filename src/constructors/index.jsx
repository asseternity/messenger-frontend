import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";
import sl_logo from "/sl_logo.png";
import Messages from "./messages";
import Feed from "./feed";
import Profile from "./profile";

/* eslint-disable react/prop-types */
const Index = ({ user, targetProfileUser, updateUser }) => {
  const [profilePicUrl, setProfilePicUrl] = useState();
  const [feedOrMessages, setFeedOrMessages] = useState("feed");
  const [searchString, setSearchString] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // const [profileUser, setProfileUser] = useState(targetProfileUser);
  const [instantConversationUser, setInstantConversationUser] = useState("");

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        if (user.profilePicture) {
          setProfilePicUrl(`${user.profilePicture}`);
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
      setInstantConversationUser("");
      setFeedOrMessages("feed");
    } else {
      setInstantConversationUser("");
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

  const handleGoToProfile = (targetUser) => {
    if (targetUser.id === user.id) {
      // setProfileUser(user);
      setFeedOrMessages("user_profile");
      updateUser(user, targetUser);
    } else {
      // setProfileUser(targetUser);
      setFeedOrMessages("user_profile");
      updateUser(user, targetUser);
    }
  };

  const goToChatFromProfile = (data) => {
    setInstantConversationUser(data);
    setFeedOrMessages("messages");
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
          <div className="username_bar_left">
            <img
              src={sl_logo}
              className="sl_logo"
              onClick={() => handleTabClick("feed")}
            />
            <img
              src={profilePicUrl}
              className="profile_picture"
              onClick={() => handleGoToProfile(user)}
            />
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
              <button type="submit">Search</button>
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
      {feedOrMessages === "feed" && (
        <Feed user={user} profileCallback={handleGoToProfile} />
      )}
      {feedOrMessages === "messages" && (
        <Messages user={user} instantConversation={instantConversationUser} />
      )}
      {feedOrMessages === "search" && (
        <div>
          {searchResults.length > 0 ? (
            <div className="search_results">
              <h2>Search results for {lastSearch}</h2>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <div className="search_results_user">
                      <img
                        src={
                          result.profilePicture
                            ? `${result.profilePicture}`
                            : defaultProfilePic
                        }
                        alt={`${result.username}'s profile`}
                        className="search_result_pic"
                      />
                      <p>{result.username}</p>
                    </div>
                    <div className="search_results_buttons">
                      <button onClick={() => handleGoToProfile(result)}>
                        Profile
                      </button>
                      <button onClick={() => goToChatFromProfile(result)}>
                        Chat
                      </button>
                    </div>
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
      {feedOrMessages === "user_profile" && (
        <Profile
          user={user}
          profileUser={targetProfileUser}
          updateUser={updateUser}
          goToChatFromProfile={goToChatFromProfile}
        />
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
// // [v] to the side of user: profile, chat (leads to postNewConversation - one on one chat)

// [v] profile component:
// // [v] open profiles through the search tab

// [v] top left - button returns to the main page

// bugs:
// [v] chat width on pc if only short messages
// [v] chats WITH messages there don't show up on the list
// [v] losing profileUser on second render
// [v] search_results margin

// final features:
// [v] click on a post to go to the user's profile
// [v] update profile pics
// [v] clickable and animated your profile upper left
// [v] non-animated profile pics in profile
// [v] login screen
// [v] registration
// [_] groupchat creation
// [_] backend - see all messages, comments and posts by date
// [_] backend - delete account
// [_] for portfolio - some guest access
