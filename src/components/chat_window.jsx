import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
const ChatWindow = ({ conversation, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState(conversation);

  useEffect(() => {
    setCurrentConversation(conversation); // Update when the prop changes
  }, [conversation]);

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
        setCurrentConversation(data);
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div>
      {currentConversation && (
        <div>
          {currentConversation.message && (
            <div className="message_window">
              {currentConversation.message.map((msg, index) => (
                <div key={index}>
                  <strong>
                    {msg.senderId === user.userId ? user.username : "other guy"}
                    :{" "}
                  </strong>
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>
          )}
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
