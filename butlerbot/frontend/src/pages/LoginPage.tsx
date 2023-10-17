import {
  Box,
  Button,
  Center,
  Heading,
  Highlight,
  Stack,
  Text,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { BiCheckboxSquare, BiBot } from "react-icons/bi";

const LoginPage = ({ onSessionTokenUpdate }) => {
  const toast = useToast();

  // handlers
  const handleSignInWithDemoAccount = () => {
    // eslint-disable-next-line no-undef
    const demoAccountToken = process.env.DEMO_BUTLERBOT_APP_SESSION_TOKEN;
    const demoAccountDeviceId = process.env.DEMO_BUTLERBOT_APP_DEVICE_ID;
    if (!demoAccountToken) {
      toast({
        title: "Application error.",
        description:
          "Application not configured properly. Missing required configurations - DEMO_BUTLERBOT_APP_SESSION_TOKEN.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }
    if (!demoAccountDeviceId) {
      toast({
        title: "Application error.",
        description:
          "Application not configured properly. Missing required configurations - DEMO_BUTLERBOT_APP_DEVICE_ID.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    onSessionTokenUpdate(demoAccountToken);
  };

  const handleSignInWithSquare = () => {
    // eslint-disable-next-line no-undef
    // if (!process.env.BUTLERBOT_API_ENDPOINT) {
    //   toast({
    //     title: "Application error.",
    //     description:
    //       "Application not configured properly. Missing required configurations - BUTLERBOT_API_ENDPOINT.",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });

    //   return;
    // }

    // eslint-disable-next-line no-undef
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
