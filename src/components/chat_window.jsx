import { useState, useEffect } from "react";

const ChatWindow = ({ conversation, targetUser, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [newConversation, setNewConversation] = useState(conversation);
  const [whichConversation, setWhichConversation] = useState(conversation);

  useEffect(() => {
    const updateChat = async () => {
      try {
        const user1 = user.username;
        const user2 = targetUser.username;
        const participants = [user1, user2];

        const response = await fetch("http://localhost:3000/new-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ participant_usernames: participants }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setNewConversation(data);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };

    updateChat();
  }, [whichConversation, newMessage, targetUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const onSendMessage = async (message) => {
    console.log(user);
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
          userId: user.userId,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setNewConversation(data);
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div>
      <h3>Chat with {targetUser.username}</h3>
      {newConversation.message && (
        <div>
          {newConversation.message.map((msg, index) => (
            <div key={index}>
              <strong>
                {msg.senderId === user.userId
                  ? user.username
                  : targetUser.username}
                :{" "}
              </strong>
              <span>{msg.content}</span>
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
