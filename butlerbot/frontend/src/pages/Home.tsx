import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
} from "@azure/communication-react";
import { initializeIcons, registerIcons } from "@fluentui/react";
import styled from "styled-components";

import {
  MessageThread,
  ChatMessage,
  MessageContentType,
  CustomMessage,
  SystemMessage,
} from "@azure/communication-react";

import axios from "axios";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function Home(): JSX.Element {
  const GetHistoryChatMessages = (): (
    | CustomMessage
    | SystemMessage
    | ChatMessage
  )[] => {
    return [
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Hey! Can I grab a beer please?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:10"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "2",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Sure, which brand?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Anything will do for me please!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "The most popular brand here is Balter, is that okay for you?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Sure",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "That will be 6 and 30cents!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Would you like to add anything else?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "No, That's all for today.",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Would you like to pay now?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Yes Please!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content:
          "Sure, you will be redirecting to the payment page, please hold on!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Thank you!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "You are very welcome!, You have a great day!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "You are very welcome!, You have a great day!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
    ];
  };
  const testCheckoutData = [
    {
      catalog_object_id: "QQZ6ZOA3IUB2HFAHW7W7GVAP",
      quantity: "1",
    },
    {
      catalog_object_id: "UF4L33R6F3QDZAKWCS4E3C64",
      quantity: "1",
    },
    // {
    //   catalog_object_id: "USQKUYCDTPSIMD4MTKT7R44T",
    //   quantity: "1",
    // },
    // {
    //   catalog_object_id: "YDVHZOMBDTTFTDTOBSVDACM5",
    //   quantity: "1",
    // },
  ];
  const cart = [
    { id: 1, name: "Pasta", quantity: 1 },
    { id: 2, name: "Steak", quantity: 1 },
  ];

  const handleCheckOut = async () => {
    const getCookieValue = (cookieName) => {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === cookieName) {
          return cookie[1];
        }
      }
      return null;
    };

    // Get session token from cookie
    const sessionToken = getCookieValue("X-ButlerBot-Active-Session-Token");
    const locationId = getCookieValue("merchant_location_id");
    const source = "terminal";

    if (sessionToken && locationId) {
      try {
        const response = await axios.post(
          `${process.env.BUTLERBOT_API_ENDPOINT}/checkout`,
          {
            source: source,
            checkoutData: testCheckoutData,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              locationId: locationId,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          if (source === "checkout") {
            window.location.href = response.data.payment_link;
          } else {
            alert(`
              message
                ${response.data.message} 
              Checkout Id:  
                ${response.data.response.checkout.id}`);
          }
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Session Token not found.");
    }
  };

  return (
    <>
      <Heading>Stellar Restaurant</Heading>
      <Container>
        <Menu>
          <h1>Our Menu</h1>
          <MenuContainer>
            <MenuItem>Pasta</MenuItem>
            <ItemDescription>
              Delicious pasta served with marinara sauce and garlic bread.
            </ItemDescription>
            <MenuItem>Steak</MenuItem>
            <ItemDescription>
              Grilled steak cooked to perfection, served with mashed potatoes
              and vegetables.
            </ItemDescription>
            <MenuItem>Salad</MenuItem>
            <ItemDescription>
              Fresh salad made with organic greens, cherry tomatoes, and
              balsamic vinaigrette.
            </ItemDescription>
            <MenuItem>Cheesecake</MenuItem>
            <ItemDescription>
              Decadent cheesecake topped with strawberries and whipped cream.
            </ItemDescription>
            <MenuItem>Burger</MenuItem>
            <ItemDescription>
              Decadent cheesecake topped with strawberries and whipped cream.
            </ItemDescription>
            <MenuItem>French Fries</MenuItem>
            <ItemDescription>
              Decadent cheesecake topped with strawberries and whipped cream.
            </ItemDescription>
          </MenuContainer>
        </Menu>
        <ChatContainer>
          <FluentThemeProvider>
            <MessageThread userId={"1"} messages={GetHistoryChatMessages()} />
          </FluentThemeProvider>
        </ChatContainer>
        <CartContainer>
          <CartItemContainer>
            {cart.map((item) => (
              <CartItem key={item.id}>
                <ItemName>{item.name}</ItemName>
                <div>
                  <ItemQuantity>{item.quantity}</ItemQuantity>
                </div>
              </CartItem>
            ))}
            <CartActions>
              <div>
                Total: $
                {cart.reduce((total, item) => total + item.quantity * 10, 0)}
              </div>
            </CartActions>
          </CartItemContainer>
          <CheckoutButton onClick={handleCheckOut}>
            Proceed to Payment
          </CheckoutButton>
        </CartContainer>
      </Container>
    </>
  );
}

export default Home;
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
  height: 100%;
  padding: 2rem;
  padding-bottom: 3rem;
  gap: 2rem;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  h1 {
    color: #000;
    font-weight: 700;
  }
`;

const MenuContainer = styled.div`
  width: 20vw;
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const ItemDescription = styled.div`
  font-size: 14px;
  color: #555;
`;
const ChatContainer = styled.div`
  flex: 1;
  padding: 2rem;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  max-height: 80vh;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
`;

const CartContainer = styled.div`
  min-width: 20vw;
  border: 1px solid #ccc;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemName = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ItemQuantity = styled.span`
  font-size: 16px;
  color: #555;
  font-weight: bold;
  margin-right: 10px;
`;
const CartItemContainer = styled.span`
  font-size: 14px;
  color: #555;
  margin-right: 10px;
`;

const CartActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  font-size: 16px;
  color: #555;
  font-weight: bold;
  border-top: 1px solid #ccc;
  margin-top: 2rem;
`;
const CheckoutButton = styled.div`
  background: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px 40px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 20px;
`;
