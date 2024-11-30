import { useState } from "react";

const ChatWindow = ({ targetUser, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div>
      <h3>Chat with {targetUser.username}</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
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
