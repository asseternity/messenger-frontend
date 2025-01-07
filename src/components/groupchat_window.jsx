import { useState, useEffect, useRef } from "react";

/* eslint-disable react/prop-types */
const GroupChatWindow = ({ conversation, allUsers, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState(conversation);
  const messageWindowRef = useRef(null);

  useEffect(() => {
    // Update when the prop changes
    // setCurrentConversation(conversation);
    const dataWithUsernames = combineGroupChatWithUsernames(
      conversation,
      allUsers
    );
    const mappedMessages = combineMessageWithUsername(
      dataWithUsernames,
      allUsers
    );
    setCurrentConversation(mappedMessages);
  }, [conversation]);

  useEffect(() => {
    // Scroll to the bottom whenever the conversation or messages change
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop =
        messageWindowRef.current.scrollHeight;
    }
  }, [currentConversation]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const onSendMessage = async (message) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/new-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            conversationId: currentConversation.id,
            content: message,
            userId: user.userId,
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const dataWithUsernames = combineGroupChatWithUsernames(data, allUsers);
        const mappedMessages = combineMessageWithUsername(
          dataWithUsernames,
          allUsers
        );
        setCurrentConversation(mappedMessages);
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  const combineGroupChatWithUsernames = (groupchat, allUsers) => {
    console.log("combineGroupChatWithUsernames called!");
    // Create a new object for the groupchat
    let newChat = {
      ...groupchat, // Spread existing groupchat properties
      participants: groupchat.participants.map((participant) => {
        // Find the user corresponding to the userId in the allUsers array
        const eachUser = allUsers.find((u) => u.id === participant.userId);
        // Add the username to the participant object
        return {
          ...participant, // spread existing participant properties
          username: eachUser ? eachUser.username : participant.username, // Ensure a fallback if user not found
        };
      }),
    };
    console.log(newChat);
    return newChat;
  };

  const combineMessageWithUsername = (groupchat, allUsers) => {
    console.log("combineMessageWithUsername calledl!");
    // Create a map of userId to username for faster lookup
    const userMap = allUsers.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});
    // Update messages with senderUsername
    groupchat.message.forEach((msg) => {
      const senderUsername = userMap[msg.senderId]; // Lookup username by senderId
      if (senderUsername) {
        msg.senderUsername = senderUsername;
      }
    });
    console.log(groupchat);
    return groupchat; // Return updated groupchat
  };

  return (
    <div className="chat_inner">
      {currentConversation && (
        <div className="message_window" ref={messageWindowRef}>
          <h2>
            Groupchat:{" "}
            {conversation.participants.map((i) => (
              <span
                key={
                  "username_lister_groupchat_" +
                  conversation.id +
                  i.user.username
                }
              >
                {i.user.username + " | "}
              </span>
            ))}
          </h2>
          {currentConversation.message.map((msg, index) => (
            <div
              key={index}
              className={
                msg.senderUsername === user.username
                  ? "chat_message my_message"
                  : "chat_message notmy_message"
              }
            >
              <div className="sender">
                {msg.senderUsername ? msg.senderUsername : user.username}
              </div>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
      )}
      <div className="chat_keyboard_div">
        <form onSubmit={handleSend} className="chat_keyboard">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatWindow;
