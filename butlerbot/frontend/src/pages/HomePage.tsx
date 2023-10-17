import { useState } from "react";
import {
  DEFAULT_COMPONENT_ICONS,
  MessageContentType,
} from "@azure/communication-react";
import { initializeIcons, registerIcons } from "@fluentui/react";
import styled from "styled-components";

import { MenuItems, Chat, Cart } from "../components/";
import { getCookie } from "../hooks";

import { useVADRecorder } from "../hooks";
import { Box, Button, Center, Icon, Stack, Text } from "@chakra-ui/react";
import { BiCheckboxSquare } from "react-icons/bi";
// import { RecorderError } from "../components/";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const HomePage = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userAction, setUserAction] = useState(null);

  // handlers
  const updateChatMessages = (response): void => {
    if (!(response && response.ai_response && response.user_prompt)) {
      console.log("silently dropping response. Reason - lack of data");
      return;
    }

    const messagesToAdd = [
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: response.user_prompt,
        createdOn: new Date(),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "2",
        senderDisplayName: "ButlerBot",
        messageId: Math.random().toString(),
        content: response.ai_response,
        createdOn: new Date(),
        mine: true,
      },
    ];

    setChatMessages([...chatMessages, ...messagesToAdd]);
  };
  const updateCartItems = (response): void => {
    if (response.instructions && response.instructions.action) {
      const { item_name, price, quantity, action } = response.instructions;

      const itemToAdd = {
        id: Math.random().toString(),
        name: item_name,
        quantity,
        price,
      };

      setCartItems([...cartItems, itemToAdd]);
      setUserAction(action);
    } else {
      console.log("silently dropping the request - no cart action necessary");
    }
  };

  useVADRecorder({
    onSpeechEndCallback: (response) => {
      updateChatMessages(response);
      updateCartItems(response);
    },
  });

  return (
    <>
      {getCookie("X-ButlerBot-Merchant-Device-Id") ? (
        <>
          <Heading>{getCookie("X-ButlerBot-Merchant-Name")}</Heading>
          <Container>
            <MenuItems />
            <Chat messages={chatMessages} />
            <Cart items={cartItems} action={userAction} />
          </Container>
        </>
      ) : (
        <Center minHeight="100vh">
          <Box
            p={10}
            borderWidth={1}
            borderRadius="lg"
            shadow="md"
            bg="white"
            width="500px"
          >
            <Stack spacing={4} align="center">
              <Heading>Welcome to ButlerBot!</Heading>
              <Text color="black" fontSize={"md"}>
                The account that you are logged in with has not attached Device
                Id
              </Text>
              <Text color="black" fontSize={"md"}>
                Don't have a <Text as="b">Square</Text> account? Don't worry
                we've got you covered 😉.
              </Text>
              <Text color="black" fontSize={"md"}>
                Play with our <Text as="b">ButlerBot</Text> Demo account.
              </Text>
              <Button colorScheme="teal" onClick={() => {}}>
                Sign in with Demo Account
              </Button>
            </Stack>
          </Box>
        </Center>
      )}
    </>
  );
};

export default HomePage;

const Heading = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1d1d24;
  margin: auto !important;
  padding-top: 2rem;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 90vh;
  padding: 2rem;
  padding-bottom: 3rem;
  gap: 2rem;
`;
