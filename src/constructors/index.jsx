import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";
import sl_logo from "/sl_logo.png";
import logout_img from "/logout.png";
import Messages from "./messages";
import Feed from "./feed";
import Profile from "./profile";
import Popup from "./popup";

/* eslint-disable react/prop-types */
const Index = ({ user, targetProfileUser, updateUser }) => {
  const [profilePicUrl, setProfilePicUrl] = useState();
  const [feedOrMessages, setFeedOrMessages] = useState("feed");
  const [searchString, setSearchString] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [instantConversationUser, setInstantConversationUser] = useState("");
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadComments, setUnreadComments] = useState([]);

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

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/notifications",
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
          setUnreadMessages(data.unreadMessages);
          setUnreadComments(data.unreadComments);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUpdates();
  }, []);

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

  const toggleNoficationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
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
            <div className="profile_picture">
              <img
                src={profilePicUrl}
                onClick={() => handleGoToProfile(user)}
              />
              <div
                className={
                  unreadComments.length === 0 && unreadMessages.length === 0
                    ? "notification_div hidden"
                    : "notification_div"
                }
                onClick={toggleNoficationPopup}
              ></div>
              {showNotificationPopup && (
                <div className="notification_popup">
                  <Popup
                    user={user}
                    unreadMessages={unreadMessages}
                    unreadComments={unreadComments}
                    closeCallback={toggleNoficationPopup}
                  />
                </div>
              )}
            </div>
            {user.username}
            <button
              className="logout_button"
              onClick={() => updateUser(null, null)}
            >
              <img src={logout_img} className="logout_img" />
            </button>
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
            Featured
          </button>
        </div>
      </div>
      {feedOrMessages === "feed" && (
        <Feed
          user={user}
          profileCallback={handleGoToProfile}
          isAllUsers={false}
        />
      )}
      {feedOrMessages === "messages" && (
        <Messages user={user} instantConversation={instantConversationUser} />
      )}
      {feedOrMessages === "allUsers" && (
        <div className="allUsers_container">
          <div className="allUsers_outer">
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
            <Feed
              user={user}
              profileCallback={handleGoToProfile}
              isAllUsers={true}
            />
          </div>
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
// [v] backend - see all messages, comments and posts by date
// [v] backend - delete account
// [v] fill with content

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
// [v] why aren't linebreaks preserved in messages or posts?
// [v] something in "home" doesn't want to go lower than 400px width
// [v] clicking "chat" from profile on someone you already have a 1-1 convo with breaks / doesn't serve username?
// [v] add a section - all posts
// [v] posts are not linebreaking in profile
// [v] on mobile in profile "posts by" cuts off in two lines with longer usernames
// [v] "following" has no max-height?
// [v] comments not sorted by date
// [v] in chats, messages not sorted by date
// [v] like comments
// [v] editing and deleting posts
// [v] jwt auto login
// [v] jwt refresh token
// [v] jwt logout
// [v] no login screen while fetching, a blank instead, use an isLoading state
// [v] nice field validations and error messages on login
// [v] edit posts in your profile
// [v] style textareas for editing posts and bio
// [v] comments editing and deleting
// [v] надо добавить функцию отвечать на сообщения и получать уведомления, когда отвечают тебе или к твоим постам
// ui: a red circle under your profile pic on top left with a number of (1) messages and (2) comments to your posts since your last login
// clicking on the red circle shows a list, and red circle disappears
// [v] for portfolio - test user - go in without the ability to leave messages etc
// [v] create guest
// [v] login as guest
// [v] prevent auto-login for guest
// [v] check: inability to post / comment / vandalize account; no auto-login
// [v] permanent notification message for guest
// [v] ui feedback / popup for no posts or comments
// [v] ui feedback for no changing bio / username
// [v] readme
