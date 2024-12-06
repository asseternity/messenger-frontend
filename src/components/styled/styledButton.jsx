import styled from "styled-components";

const PhoneButton = styled.button`
  display: inline-block;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #007aff; /* iPhone blue */
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  /* iOS-style pressed state */
  &:active {
    background-color: #005bb5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: scale(0.98);
  }

  /* iOS-style hover effect */
  &:hover {
    background-color: #005bb5; /* Darker blue for hover */
  }

  /* Disabled state */
  &:disabled {
    background-color: #b0b0b0; /* Light gray */
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default PhoneButton;
