import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
const ChatWindow = ({ conversation, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [newConversation, setNewConversation] = useState();
  const [whichConversation, setWhichConversation] = useState(conversation);

  useEffect(() => {
    console.log(conversation);
    const updateChat = async () => {
      try {
        const response = await fetch(
          `https://messenger-backend-production-a259.up.railway.app/conversation/${whichConversation.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setNewConversation(data);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    updateChat();
  }, [whichConversation, newMessage]);

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
            conversationId: newConversation.id,
            content: message,
            userId: user.userId,
          }),
          credentials: "include",
        }
      );
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
      {newConversation && (
        <div>
          {newConversation.message && (
            <div className="message_window">
              {newConversation.message.map((msg, index) => (
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
