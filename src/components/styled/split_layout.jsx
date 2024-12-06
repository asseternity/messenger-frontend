import styled from "styled-components";

const SplitLayout = styled.div`
  display: flex;
  width: 100vw; /* Full width of the window */
  height: 90vh;

  /* Children styles */
  & > div:first-child {
    flex: 0 0 30%; /* Left column takes 30% of the width */
    background-color: #7d7d7d;
    display: flex; /* Center content inside */
    justify-content: end;
    align-items: start;
    border-radius: 0 10px 10px 0; /* top-right, bottom-right */
  }

  & > div:last-child {
    flex: 0 0 70%; /* Right column takes 70% of the width */
  }
`;

export default SplitLayout;
