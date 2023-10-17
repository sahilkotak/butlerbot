import { FluentThemeProvider, MessageThread } from "@azure/communication-react";
import { Text } from "@chakra-ui/react";
import styled from "styled-components";

const Chat = ({ messages }) => {
  const vad = { loading: false, errored: false, usSpeaking: true };
  return (
    <ChatContainer>
      <FluentThemeProvider>
        <MessageThread userId={"1"} messages={messages} />
      </FluentThemeProvider>
      {vad.loading ? (
        <Text>VAD loading...</Text>
      ) : vad.errored ? (
        <Text>Error Occured...</Text>
      ) : vad.usSpeaking ? (
        <Text>User speaking is speaking.</Text>
      ) : (
        <Text>VAD is actively listening.</Text>
      )}
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  flex: 1;
  padding: 2rem;
  border: 1px solid #ccc;
  background-color: #fff;
  max-height: 90vh;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  padding-bottom: 3rem;
  p {
    color: black;
    font-weight: 500;
    font-size: 14px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;
