import { FluentThemeProvider, MessageThread } from "@azure/communication-react";
import { VStack, Center, Image, Text } from "@chakra-ui/react";
import styled from "styled-components";

import BotChat from "./BotChat";

const Chat = ({ messages, botStatus }) => {
  return (
    <ChatContainer>
      {messages.length > 0 ? (
        <FluentThemeProvider>
          <MessageThread userId={"1"} messages={messages} />
        </FluentThemeProvider>
      ) : (
        <StartupDisplay />
      )}

      <BotChat status={botStatus} />
    </ChatContainer>
  );
};

const StartupDisplay = () => {
  return (
    <Center h={"100%"} w={"100%"} color={"white"}>
      <VStack>
        <Image
          src="https://ntibnportal.powerappsportals.com/but.png"
          alt="ButlerBot Icon"
        />
        <Text color="black">Let's start ordering...</Text>
      </VStack>
    </Center>
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
`;
