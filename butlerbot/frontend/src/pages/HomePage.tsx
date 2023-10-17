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
    if (response && response.instructions && response.instructions.action) {
      const { item_name, price, quantity, action } = response.instructions;

      if (action === UserAction.AddToCart) {
        const itemToAdd = {
          id: Math.random().toString(),
          name: item_name,
          quantity,
          price,
        };

        setCartItems([...cartItems, itemToAdd]);
        setUserAction(UserAction.AddToCart);
      } else if (action === UserAction.Checkout) {
        setUserAction(UserAction.Checkout);
      } else {
        console.log("unknown action requested - ", action);
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
        <RecorderError message={vad.errored.message} />
      ) : vad.loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Heading>{merchantName}</Heading>
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
