import { useState, useEffect, useRef } from "react";

/* eslint-disable react/prop-types */
const ChatWindow = ({ conversation, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState(conversation);
  const [imageSendingMode, setImageSendingMode] = useState(false);
  const messageWindowRef = useRef(null);

  useEffect(() => {
    setCurrentConversation(conversation); // Update when the prop changes
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

  const handleSendImage = (e) => {
    e.preventDefault();
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
    <div className="chat_inner">
      {currentConversation && currentConversation.message && (
        <div className="message_window" ref={messageWindowRef}>
          <h2>
            Chat with{" "}
            {conversation.participants.map((i) => (
              <span
                key={"username_lister_1-1_" + conversation.id + i.user.username}
              >
                {i.user.username === user.username ? "" : i.user.username}
              </span>
            ))}
          </h2>
          {currentConversation.message.map((msg, index) => (
            <div
              key={index}
              className={
                msg.senderId === user.userId
                  ? "chat_message my_message"
                  : "chat_message notmy_message"
              }
            >
              <div className="sender">
                {msg.senderId === user.userId
                  ? user.username
                  : msg.sender.username}
              </div>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
      )}
      <div className="chat_keyboard_div">
        <div className="chat_keyboard_mode_buttons">
          <div
            className={
              imageSendingMode
                ? "chat_keyboard_mode_button"
                : "chat_keyboard_mode_button chat_button_selected"
            }
            onClick={() => setImageSendingMode(false)}
          >
            Text
          </div>
          <div
            className={
              imageSendingMode
                ? "chat_keyboard_mode_button chat_button_selected"
                : "chat_keyboard_mode_button"
            }
            onClick={() => setImageSendingMode(true)}
          >
            Image
          </div>
        </div>
        {!imageSendingMode && (
          <form onSubmit={handleSend} className="chat_keyboard">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        )}
        {imageSendingMode && (
          <form onSubmit={handleSendImage} className="chat_keyboard">
            <div className="chat_keyboard_image">
              <label>Insert the image URL below...</label>
              <input
                style={{ width: "100%" }}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="https://yourwebsite.com/image.jpg"
              />
            </div>
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
