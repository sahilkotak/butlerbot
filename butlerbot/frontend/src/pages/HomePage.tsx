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
      <>
        <Heading>{getCookie("X-ButlerBot-Merchant-Name")}</Heading>
        <Container>
          <MenuItems />
          <Chat messages={chatMessages} />
          <Cart items={cartItems} action={userAction} />
        </Container>
      </>
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
