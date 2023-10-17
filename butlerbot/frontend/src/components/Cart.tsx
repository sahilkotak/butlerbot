import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ModalContainer from "./ModalContainer";
import { getCookie } from "../hooks/useCookie";

const Cart = ({ items, action }) => {
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

    if (action === "add_to_cart") {
      console.log("action - add_to_cart - requested");
    } else if (action === "checkout") {
      handleCheckOut();
    } else {
      console.log("unknown action requested - ", action);
    }

    //eslint-disable-next-line
  }, [action]);

  return (
    <CartContainer>
      <CartItemContainer>
        {items.map((item) => (
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
            {items.reduce((total, item) => total + item.quantity * 10, 0)}
          </div>
        </CartActions>
      </CartItemContainer>
      {showModal && (
        <ModalContainer showModal={showModal} setShowModal={setShowModal} />
      )}
    </CartContainer>
  );
};

export default Cart;

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
