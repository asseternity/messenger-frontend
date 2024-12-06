import styled from "styled-components";

const PhoneButton2 = styled.button`
  display: inline-block;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  /* iOS-style pressed state */
  &:active {
    background-color: #005bb5;
    transform: scale(0.98);
  }

  /* iOS-style hover effect */
  &:hover {
    background-color: #b0b0b0; /* Light gray */
  }
`;

export default PhoneButton2;
