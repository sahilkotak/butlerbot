import { useState } from "react";
import {
  DEFAULT_COMPONENT_ICONS,
  MessageContentType,
} from "@azure/communication-react";
import { Center, Heading, Highlight, Text } from "@chakra-ui/react";
import { initializeIcons, registerIcons } from "@fluentui/react";
import styled from "styled-components";

import { MenuItems, Chat, Cart } from "../components/";
import { getCookie } from "../hooks";

import { useVADRecorder } from "../hooks";
import { BotState, UserAction } from "../enums";
import { RecorderError } from "../components/";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const HomePage = () => {
  const [merchantCurrency, setMerchantCurrency] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [isBotThinking, setBotThinkingStatus] = useState<BotState>(
    BotState.NotThinking
  );

  const merchantName =
    getCookie("X-ButlerBot-Merchant-Name") || "ButlerBot powered Kiosk";

  // handlers
  const clearAppState = () => {
    setChatMessages([]);
    setCartItems([]);
    setUserAction(null);
    setBotThinkingStatus(BotState.NotThinking);
  };
  const updateChatMessages = (response): void => {
    if (!(response && response.ai_response && response.user_prompt)) {
      console.log("silently dropping response. Reason - lack of data");
      return;
    }

    const messagesToAdd = [];
    if (response.user_prompt) {
      // user response
      messagesToAdd.push({
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: response.user_prompt,
        createdOn: new Date(),
        mine: false,
      });
    }
    // butlerbot response
    messagesToAdd.push({
      messageType: "chat",
      contentType: "text" as MessageContentType,
      senderId: "2",
      senderDisplayName: "ButlerBot",
      messageId: Math.random().toString(),
      content: response.ai_response,
      createdOn: new Date(),
      mine: true,
    });

    setChatMessages([...chatMessages, ...messagesToAdd]);
  };
  const updateCartItems = (response): void => {
    if (response && response.instructions) {
      if (response.instructions.length > 0) {
        const { action } = response.instructions[0].action;
        if (action === UserAction.AddToCart) {
          const updatedItems = [];

          for (let i = 0; i < response.instructions.length; i++) {
            const { item_name, price, quantity } = response.instructions[i];

            const itemToAdd = {
              id: Math.random().toString(),
              name: item_name,
              quantity,
              price,
            };
            updatedItems.push(itemToAdd);
          }

          setCartItems(updatedItems);
          setUserAction(UserAction.AddToCart);
        } else if (action === UserAction.Checkout) {
          setUserAction(UserAction.Checkout);
        } else {
          console.log("unknown action requested - ", action);
        }
      }
    } else {
      console.log("silently dropping the request - no cart action necessary");
    }
  };

  const vad = useVADRecorder({
    onSpeechEndCallback: (response) => {
      updateChatMessages(response);
      updateCartItems(response);
      setBotThinkingStatus(BotState.NotThinking);
    },
    onSpeechEndPrecursor: () => {
      setBotThinkingStatus(BotState.Thinking);
    },
  });

  return (
    <>
      {vad.errored ? (
        <Center h="100vh" color="white">
          <RecorderError message={vad.errored.message} />
        </Center>
      ) : vad.loading ? (
        <Center h="100vh" color="white">
          <Text color={"black"}>Initialising ButlerBot. Won't be long...</Text>
        </Center>
      ) : (
        <>
          <Center h="100px" color="white">
            <Heading as="h2" size="lg">
              <Highlight
                query={merchantName}
                styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
              >
                {merchantName}
              </Highlight>
            </Heading>
          </Center>

          <Container>
            <MenuItems onCurrencyUpdate={setMerchantCurrency} />
            <Chat
              messages={chatMessages}
              botStatus={
                vad.userSpeaking
                  ? BotState.UserSpeaking
                  : isBotThinking === BotState.Thinking
                  ? isBotThinking
                  : BotState.Listening
              }
            />
            <Cart
              items={cartItems}
              action={userAction}
              currency={merchantCurrency}
              onCheckoutCompletion={clearAppState}
            />
          </Container>
        </>
      )}
    </>
  );
};

export default HomePage;

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 90vh;
  padding: 2rem;
  padding-bottom: 3rem;
  gap: 2rem;
`;
