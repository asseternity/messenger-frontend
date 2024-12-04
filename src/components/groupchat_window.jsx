import { useState, useEffect } from "react";

const GroupChatWindow = ({ conversation, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [newConversation, setNewConversation] = useState(conversation);

  useEffect(() => {
    const updateChat = async () => {
      try {
        // fetch the conversation again to get the new messages
        // and save it to setNewConversation
      } catch (err) {
        console.error("Error during fetch", err);
      }
    };

    updateChat();
  }, [conversation, newMessage]);

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

  const combineGroupChatsWithUsernames = (groupchats, allUsers) => {
    return groupchats.map((chat) => {
      // Create a new object for each groupchat
      let newChat = {
        ...chat, // Spread existing chat properties
        participants: chat.participants.map((participant) => {
          // Find the user corresponding to the userId in the allUsers array
          const user = allUsers.find((u) => u.id === participant.userId);
          // Add the username to the participant object
          return {
            ...participant, // spread existing participant properties
            username: user ? user.username : "you", // add username (or null if not found)
          };
        }),
      };
      return newChat;
    });
  };

  return (
    <div>
      <h3>Chat with </h3>{" "}
      {/* !!! list the users with the same function as in users_list !!! */}
      {newConversation.message && (
        <div>
          {newConversation.message.map((msg, index) => (
            <div key={index}>
              <strong>
                {msg.senderId === user.userId
                  ? user.username
                  : targetUser.username}{" "}
                {/* !!! need a new way to understand who sent the message !!! */}
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
