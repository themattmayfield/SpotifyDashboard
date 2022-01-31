import styled, { keyframes } from "styled-components";

const dance = keyframes`
  from {
    height: 10px;
  }
  to {
    height: 100%;
  }
`;

const Bar = styled.div`
  width: 10px;
  height: 5px;
  margin: 0 2px;
  background-color: rgba(27, 27, 27, var(--tw-bg-opacity));
  animation-name: ${dance};
  animation-duration: 400ms;
  animation-play-state: running;
  animation-direction: alternate;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-delay: ${(props) => props.delay || "0ms"};
`;

const Loading = () => (
  <div className="flex justify-center items-center w-full h-[90vh]">
    <div className="flex justify-center items-end overflow-hidden w-[100px] min-w-[100px] h-[50px] my-0 mx-auto z-20 relative left-0 right-0">
      <Bar delay="250ms" />
      <Bar delay="715ms" />
      <Bar delay="475ms" />
      <Bar delay="25ms" />
      <Bar delay="190ms" />
    </div>
  </div>
);

export default Loading;
