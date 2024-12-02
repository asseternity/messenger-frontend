import { useState, useEffect } from "react";

const ChatWindow = ({ conversation, targetUser, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [newConversation, setNewConversation] = useState(conversation);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const onSendMessage = async (message) => {
    console.log(message);
    try {
      const response = await fetch("http://localhost:3000/new-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          conversationId: newConversation.id,
          content: message,
          userId: user.id,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setNewConversation(data);
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div>
      <h3>Chat with {targetUser.username}</h3>
      {newConversation.messages && (
        <div>
          {newConversation.messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}: </strong>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
