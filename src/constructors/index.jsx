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
    } else if (section === "messages") {
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
    setFeedOrMessages("user_profile");
    updateUser(user, targetUser);
  };

  const goToChatFromProfile = (data) => {
    setInstantConversationUser(data);
    setFeedOrMessages("messages");
  };

  const setUsernameBarClass = (tab) => {
    switch (tab) {
      case "feed":
        return "username_bar username_bar_feed";
      case "messages":
        return "username_bar username_bar_messages";
      case "user_profile":
        return "username_bar username_bar_other";
      case "search":
        return "username_bar username_bar_other";
      case "allUsers":
        return "username_bar username_bar_allUsers";
    }
  };

  const handleClickAllUsers = async () => {
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
            targetUsername: "",
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setInstantConversationUser("");
        setFeedOrMessages("allUsers");
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
        <div className={setUsernameBarClass(feedOrMessages)}>
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
          <button
            className={
              feedOrMessages === "allUsers"
                ? "tab_bar allUsersActive"
                : "tab_bar allUsersInactive"
            }
            onClick={handleClickAllUsers}
          >
            All users
          </button>
        </div>
      </div>
      {feedOrMessages === "feed" && (
        <Feed user={user} profileCallback={handleGoToProfile} />
      )}
      {feedOrMessages === "messages" && (
        <Messages user={user} instantConversation={instantConversationUser} />
      )}
      {feedOrMessages === "allUsers" && (
        <div className="allUsers_container">
          <h2>All users</h2>
          {searchResults.length > 0 ? (
            <div className="allUsers_inner">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="allUsers_user"
                  onClick={() => handleGoToProfile(result)}
                >
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
              ))}
              <div className="search_results_filler"></div>
            </div>
          ) : (
            <div className="search_results">No results</div>
          )}
        </div>
      )}
      {feedOrMessages === "search" && (
        <div>
          {searchResults.length > 0 ? (
            <div className="search_results search_for_user">
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
            <div className="search_results">No results</div>
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

// final features:
// [v] click on a post to go to the user's profile
// [v] update profile pics
// [v] clickable and animated your profile upper left
// [v] non-animated profile pics in profile
// [v] login screen
// [v] registration
// [v] groupchat creation
// [v] fix hooking up creation of a groupchat
// [v] groupchat window width / loading screen
// [v] liking and unliking posts!
// [v] popup for your profile page: list of users you follow and unfollow them
// [v] list of all users

// bugs:
// [v] chat width on pc if only short messages
// [v] chats WITH messages there don't show up on the list
// [v] losing profileUser on second render
// [v] search_results margin
// [v] crash after post creation
// [v] crash after profile pic change
// [v] new profile pic not showing
// [v] not all chats showing in messages. for "test", where's "test3" and "CoolUsernameBro"?
// [v] display who's your current chat with, whether it's a groupchat etc
// [v] it's the CHAT button in profile and search - it doesn't go to the one on one!
// [v] YOUR messages not on the right in groupchats
// [v] profile pics not showing in "following"
// [v] "following" scrollable
// [v] make "click to unfollow" small and only showing for you
// [v] follow and chat cover bio in others profiles
// [v] if you're already looking at a profile, top left for your own profile doesn't work
// [v] max width of any message, smaller text a little
// [v] in one on one chat, partner is called "other guy"
// [v] just use it for a while doing every kind of shit i can think of
// [v] add to admin panel - latest comments and latest posts
// [v] clicking on an ACTIVE comment box removes the text
// [v] box of follows grows too big and overflows
// [v] now box of follows is too small, doesn't grow as responsive!!!
// [v] bio too wide on mobile (example - garrick)
// [v] long usernames go out of the box in allUsers
// [v] all users doesn't scroll
// [v] profile doesn't scroll on mobile (posts too small). make both containers scrollable
// [_] why aren't linebreaks preserved in messages or posts?
// [_] in chats, messages not sorted by date
// [_] add a section - all posts
// [_] test user - go in without the ability to leave messages etc
// [_] надо добавить функцию отвечать на сообщения и получать уведомления, когда отвечают тебе или к твоим постам
// [_] like comments

// backend:
// [v] backend - see all messages, comments and posts by date
// [v] backend - delete account
// [_] fill with content
// [_] automcomplete? bring back persistent sessions?
// [_] for portfolio - some guest access
// [_] readme

// post publish:
// [_] nice field validations and error messages on login
