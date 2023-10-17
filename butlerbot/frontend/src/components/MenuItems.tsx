import { useState, useEffect } from "react";
import {
  Box,
  Center,
  Divider,
  Heading,
  Badge,
  Text,
  Stat,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import axios from "axios";
import styled from "styled-components";

import { getCookie } from "../hooks/useCookie";

const MenuItems = ({ onCurrencyUpdate }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const merchant_id = getCookie("X-ButlerBot-Merchant-Id");

    const getMenuItems = async () => {
      try {
        const response = await axios.get(`/get-menu`, {
          headers: {
            ButlerbotMerchantId: merchant_id,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setItems(response.data.items);
          onCurrencyUpdate(response.data.currency);
        } else {
          setItems([]);
          throw Error("something went wrong while fetching menu items");
        }
      } catch (e) {
        console.error("failed fetching menu items", e.message);
      }
    };

    getMenuItems();
    // eslint-disable-next-line
  }, []);

  return (
    <Menu>
      <Heading as="h3" size="lg" marginBottom={"5px"}>
        Our Menu
      </Heading>

      <MenuContainer>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Box margin={"3px"} key={index}>
              <Stat>
                <StatNumber>
                  {item.item_name}
                  {"   "}
                  <Badge>{item.variation_name}</Badge>
                  {"   "}
                  <Badge colorScheme="green">{`${item.price} ${item.currency}`}</Badge>
                </StatNumber>
                <StatHelpText>{item.item_description}</StatHelpText>
              </Stat>
              <Divider orientation="horizontal" />
            </Box>
          ))
        ) : (
          <Center h="100px" color="white">
            <Text color={"black"}>Looks empty</Text>
          </Center>
        )}
      </MenuContainer>
    </Menu>
  );
};

export default MenuItems;

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
  min-width: 300px;
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
`;

// const MenuItem = styled.div`
//   display: flex;
//   gap: 10px;
//   justify-content: space-between;
//   align-items: start;
//   font-size: 18px;
//   font-weight: bold;
//   p {
//     color: #000;
//   }
// `;

// const Variation = styled.div`
//   font-size: 16px;
//   color: #999090;
//   font-weight: 700;
//   margin-bottom: 10px;
// `;
// const ItemDescription = styled.div`
//   font-size: 14px;
//   color: #555;
//   margin-bottom: 10px;
// `;
