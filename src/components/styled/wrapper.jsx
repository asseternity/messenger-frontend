import styled from "styled-components";

const MessageBubbleWrapper = styled.div`
  display: inline-block;
  max-width: 80%;
  padding: 15px;
  margin: 10px 0;
  background-color: #daf8ff; /* Light blue color */
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  white-space: pre-wrap;

  /* Optional: adjust styles for responsiveness */
  @media (max-width: 600px) {
    max-width: 90%;
    padding: 12px;
  }

  /* Optional: add a little animation for entering */
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default MessageBubbleWrapper;
