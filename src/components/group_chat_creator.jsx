import { useState } from "react";

/* eslint-disable react/prop-types */
const GroupChatCreator = ({ user, allUsers }) => {
  const [addedUsers, setAddedUsers] = useState([]);

  const handleAddUser = (userToAdd) => {
    // check if userToAdd is already in addedUsers
    const userAlreadyAdded = addedUsers.filter(
      (item) => item.id === userToAdd.id
    );
    if (addedUsers.length > 10) {
      alert(
        "You've added too many people! Maximum number of groupchat participants is 10."
      );
    } else {
      if (userAlreadyAdded.length > 0) {
        setAddedUsers(addedUsers.filter((item) => item.id !== userToAdd.id));
      } else {
        setAddedUsers([...addedUsers, userToAdd]);
      }
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
        // Navigate to the newly created groupchat
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div className="groupchat_container">
      <div className="groupchat_creator">
        <h3>Create a groupchat</h3>
        {addedUsers.length > 0 ? (
          <div className="groupchat_status">
            {"New groupchat: "}
            {addedUsers.map((item) => (
              <span key={item.id}>{item.username} | </span>
            ))}
          </div>
        ) : (
          <div className="groupchat_status">
            Click on a friend to add them to the groupchat!
          </div>
        )}
        <div className="groupchat_roster">
          <ul>
            {allUsers.map((item) => (
              <div key={item.id}>
                <li key={item.id}>
                  <button
                    className="chat_button"
                    onClick={() => handleAddUser(item)}
                  >
                    {item.username}
                  </button>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <button
          className="login_button"
          onClick={() => handleCreateGroupchat()}
        >
          Create groupchat
        </button>
      </div>
    </div>
  );
};

export default GroupChatCreator;
