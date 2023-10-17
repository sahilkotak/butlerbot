import {
  Box,
  Button,
  Center,
  Heading,
  Highlight,
  Stack,
  Text,
  Icon,
  // useToast,
} from "@chakra-ui/react";
import { BiCheckboxSquare, BiBot } from "react-icons/bi";
import { setCookie } from "../hooks/useCookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleSignInWithDemoAccount = () => {
    setCookie(
      "X-ButlerBot-Active-Session-Token",
      process.env.X_ButlerBot_Active_Session_Token
    );
    setCookie("X-ButlerBot-Merchant-Id", process.env.X_ButlerBot_Merchant_Id);
    setCookie(
      "X-ButlerBot-Merchant-Name",
      process.env.X_ButlerBot_Merchant_Name
    );
    setCookie("X-ButlerBot-Merchant-Loc", process.env.X_ButlerBot_Merchant_Loc);

    navigate("/index.html", { replace: true });
  };

  const handleSignInWithSquare = () => {
    window.location.href = `/authorise`;
  };

  return (
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
          <Heading size="lg">Welcome to ButlerBot!</Heading>
          <Text color="black" fontSize={"md"}>
            <Highlight
              query={"Square"}
              styles={{
                px: "2",
                py: "1",
                rounded: "full",
                bg: "teal.100",
                fontWeight: "bold",
              }}
            >
              Please sign in using your Square Seller account.
            </Highlight>
          </Text>
          <Button
            colorScheme="blue"
            onClick={handleSignInWithSquare}
            rightIcon={<Icon as={BiCheckboxSquare} boxSize={8} />}
          >
            Sign in with Square
          </Button>
          <Text color="black" fontSize={"md"}>
            <Highlight
              query={"Square"}
              styles={{
                px: "2",
                py: "1",
                rounded: "full",
                bg: "teal.100",
                fontWeight: "bold",
              }}
            >
              Don't have a Square account? Don't worry we've got you covered 😉.
            </Highlight>
          </Text>
          <Text color="black" fontSize={"md"}>
            <Highlight
              query={"ButlerBot"}
              styles={{
                px: "2",
                py: "1",
                rounded: "full",
                bg: "red.100",
                fontWeight: "bold",
              }}
            >
              Play with our ButlerBot Demo account.
            </Highlight>
          </Text>
          <Button
            colorScheme="teal"
            onClick={handleSignInWithDemoAccount}
            rightIcon={<Icon as={BiBot} boxSize={6} />}
          >
            Sign in with Demo Account
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default LoginPage;
