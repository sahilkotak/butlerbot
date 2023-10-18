import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Center,
  Divider,
  Flex,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import styled from "styled-components";

import { getCookie } from "../hooks/useCookie";
import ModalContainer from "./ModalContainer";
import { UserAction } from "../enums";

const Cart = ({ items, action, currency, onCheckoutCompletion }) => {
  const cartTotal = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const [showModal, setShowModal] = useState({});
  const access_token = getCookie("X-ButlerBot-Active-Session-Token");
  const deviceId = getCookie("X-ButlerBot-Merchant-Device-Id");

  const handleCheckOut = async () => {
    try {
      const response = await axios.post(
        `/checkout`,
        {
          amount: cartTotal,
          currency: currency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
            deviceId: deviceId,
          },
        }
      );

      if (response.status === 200) {
        setShowModal({ display: true, content: true });
      } else {
        setShowModal({ display: true, content: false });
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!action) return;

    if (action === UserAction.AddToCart) {
      console.log("action - add_to_cart - requested");
    } else if (action === UserAction.Checkout) {
      handleCheckOut();
    } else {
      console.log("unknown action requested - ", action);
    }
    // eslint-disable-next-line
  }, [action]);

  return (
    <CartWrapper>
      <Heading as="h3" size="lg" marginBottom={"5px"}>
        Cart
      </Heading>

      <CartContainer>
        <ModalContainer
          showModal={showModal}
          setShowModal={setShowModal}
          onCheckoutCompletion={onCheckoutCompletion}
        />

        {items.length > 0 ? (
          items.map((item) => (
            <Box key={item.id}>
              <Flex color="white" alignItems="center">
                <Stat>
                  <StatNumber color={"black"}>{item.name}</StatNumber>
                </Stat>
                <Badge variant="outline">{item.quantity}</Badge>
                <Text fontSize="sm" color={"black"} margin={"5px"}>
                  x
                </Text>
                <Badge>{`${item.price} ${currency}`}</Badge>
              </Flex>
              <Divider orientation="horizontal" />
            </Box>
          ))
        ) : (
          <Center h="100px" color="white">
            <Text color={"black"}>Looks empty</Text>
          </Center>
        )}

        {items.length > 0 && (
          <Stat marginTop={"10px"}>
            <StatLabel>Total</StatLabel>
            <StatNumber>
              {cartTotal} {currency}
            </StatNumber>
          </Stat>
        )}
      </CartContainer>
    </CartWrapper>
  );
};

export default Cart;

const CartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  h1 {
    color: #000;
    font-weight: 700;
  }
`;

const CartContainer = styled.div`
  width: 20vw;
  min-width: 300px;
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;
