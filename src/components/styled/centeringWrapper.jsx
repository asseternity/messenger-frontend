import styled from "styled-components";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: transparent; /* Optional: Set a background color if needed */

  /* Optional: To ensure it works well with parents with no height defined */
  min-height: 100vh; /* For full height if the parent isn't constrained */
`;

export default CenteredContainer;
