import { useState } from "react";

/* eslint-disable react/prop-types */
const GroupChatCreator = ({ user, allUsers, callbackHandler }) => {
  const [addedUsers, setAddedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="groupchat_container">
      <div className="groupchat_creator">
        <h3 className="groupchat_title">Create a groupchat</h3>
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
          {isLoading ? (
            <div>{"Loading..."}</div>
          ) : (
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
          )}
        </div>
        <button
          className="login_button"
          onClick={() => {
            setIsLoading(true);
            callbackHandler([...addedUsers, user]);
          }}
        >
          Create groupchat
        </button>
      </div>
    </div>
  );
};

export default GroupChatCreator;
