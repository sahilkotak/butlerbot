import { FluentThemeProvider, MessageThread } from "@azure/communication-react";
import styled from "styled-components";

import BotChat from "./BotChat";

const Chat = ({ messages, botStatus }) => {
  return (
    <ChatContainer>
      <FluentThemeProvider>
        {messages.length > 0 ? (
          <MessageThread userId={"1"} messages={messages} />
        ) : (
          <div className="bot">
            <img src="https://i.imgur.com/EslQFq9.png" alt="bot" />
          </div>
        )}
      </FluentThemeProvider>

      <BotChat status={botStatus} />
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
  padding-bottom: 3rem;

  .bot {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
