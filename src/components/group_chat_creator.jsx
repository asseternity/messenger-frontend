import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* eslint-disable react/prop-types */
const GroupChatCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addedUsers, setAddedUsers] = useState([]);
  const { user, allUsers } = location.state || {};
  // should list all users
  // with a button to add user to groupchat
  // if the button is clicked, the button is changed to "remove"
  // on top, participants of the new groupchat
  // and at the bottom, a button to submit creation of the group chat
  // then, the groupchat creator component is unmounted
  // the users_list component is re-rendered, and shows the new groupchat

  const handleAddUser = (userToAdd) => {
    // check if userToAdd is already in addedUsers
    const userAlreadyAdded = addedUsers.filter(
      (item) => item.id === userToAdd.id
    );
    if (userAlreadyAdded.length > 0) {
      setAddedUsers(addedUsers.filter((item) => item.id !== userToAdd.id));
    } else {
      setAddedUsers([...addedUsers, userToAdd]);
    }
  };

  const handleCreateGroupchat = async () => {
    try {
      let arrayIncludingUs = [...addedUsers, user];

      let usernameArray = arrayIncludingUs.map((item) => item.username);

      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/new-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ participant_usernames: usernameArray }),
        }
      );
      if (response.ok) {
        // const data = await response.json();
        // After successfully creating the group chat, navigate back to the UsersList
        navigate("/"); // Navigate back to the users list (or any other route you want)
        // close the UI and go back to users_list
        // have the users_list reload
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div>
      <div className="groupchat_creator">
        <h1>Create a groupchat!</h1>
        <p>Users to add to groupchat: </p>
        <p>
          {" "}
          {addedUsers.map((item) => (
            <span key={item.id}>{item.username} | </span>
          ))}
        </p>
        <p>All users: </p>
        <ul>
          {allUsers.map((item) => (
            <div key={item.id}>
              <li key={item.id}>
                <button onClick={() => handleAddUser(item)}>
                  {item.username}
                </button>
              </li>
            </div>
          ))}
        </ul>
        <button onClick={() => handleCreateGroupchat()}>
          Create groupchat
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default GroupChatCreator;
