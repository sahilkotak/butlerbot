import { useEffect } from "react";
import styled from "styled-components";
import { getCookie } from "../hooks/useCookie";
import axios from "axios";

const Cart = ({ items, action }) => {
  // handlers
  const handleCheckOut = async () => {
    // Get session token from cookie
    const sessionToken = getCookie("X-ButlerBot-Active-Session-Token");
    const deviceId = getCookie("X-ButlerBot-Merchant-Loc");

    if (sessionToken && deviceId) {
      try {
        const response = await axios.post(
          `/checkout`,
          {
            checkoutData: items,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              deviceId: deviceId,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert(`
              message
                ${response.data.message}
              Checkout Id:
                ${response.data.response.checkout.id}`);
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

  useEffect(() => {
    if (!action) return;

    if (action === "add_to_cart") {
      console.log("action - add_to_cart - requested");
    } else if (action === "checkout") {
      handleCheckOut();
    } else {
      console.log("unknown action requested - ", action);
    }

    // eslint-disable-next-line
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

      {/* <CheckoutButton onClick={handleCheckOut}>
        Proceed to Payment
      </CheckoutButton> */}
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
