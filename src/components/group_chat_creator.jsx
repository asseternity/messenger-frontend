import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

      const response = await fetch("http://localhost:3000/new-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ participant_usernames: usernameArray }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Created groupchat with participants:", data.participants);

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
      <h1>Create a groupchat!</h1>
      <h2>
        Users to add to groupchat:
        {addedUsers.map((item) => (
          <span key={item.id}>{item.username} | </span>
        ))}
      </h2>
      <h2>All users: </h2>
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
      <button onClick={() => handleCreateGroupchat()}>Create groupchat</button>
    </div>
  );
};

export default GroupChatCreator;
