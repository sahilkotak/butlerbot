import { FluentThemeProvider, MessageThread } from "@azure/communication-react";
import styled from "styled-components";

const Chat = ({ messages, botStatus }) => {
  return (
    <ChatContainer>
      <FluentThemeProvider>
        <MessageThread userId={"1"} messages={messages} />
      </FluentThemeProvider>

      <p>{botStatus}</p>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  flex: 1;
  padding: 2rem;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  max-height: 90vh;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  p {
    color: black;
    font-weight: 700;
    font-size: 20px;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;
