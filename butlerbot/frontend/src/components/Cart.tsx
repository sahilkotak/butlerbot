import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Center,
  Divider,
  Heading,
  Badge,
  Text,
  Stat,
  StatNumber,
} from "@chakra-ui/react";
import styled from "styled-components";

import { getCookie } from "../hooks/useCookie";
import ModalContainer from "./ModalContainer";
import { UserAction } from "../enums";

const Cart = ({ items, action, currency }) => {
  const cartTotal = items.reduce(
    (total, item) => total + item.quantity * (item.price / 100),
    0
  );
  const [showModal, setShowModal] = useState({});
  const access_token = getCookie("X-ButlerBot-Active-Session-Token");

  const handleCheckOut = async () => {
    try {
      const response = await axios.post(
        `/checkout`,
        {
          checkoutData: items,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
            deviceId: "9fa747a2-25ff-48ee-b078-04381f7c828f",
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
        <ModalContainer showModal={showModal} setShowModal={setShowModal} />
        {items.length > 0 ? (
          items.map((item) => (
            <Box key={item.id}>
              <Stat>
                <StatNumber>
                  {item.name}
                  {"        "}
                  <Badge>{item.quantity}</Badge>
                  {"    "}
                  <Badge>{`${item.price / 100} ${currency}`}</Badge>
                </StatNumber>
              </Stat>
              <Divider orientation="horizontal" />
            </Box>
          ))
        ) : (
          <Center h="100px" color="white">
            <Text color={"black"}>Looks empty</Text>
          </Center>
        )}

        {items.length > 0 && (
          <CartActions>
            <div>
              Total:
              {cartTotal} {currency}
            </div>
          </CartActions>
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
`;

// const CartItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 10px;
// `;

// const ItemName = styled.span`
//   font-size: 18px;
//   font-weight: bold;
// `;

// const ItemQuantity = styled.span`
//   font-size: 16px;
//   color: #555;
//   font-weight: bold;
//   margin-right: 10px;
// `;
// const CartItemContainer = styled.span`
//   font-size: 14px;
//   color: #555;
//   margin-right: 10px;
// `;

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
