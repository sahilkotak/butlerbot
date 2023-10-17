import {
  Box,
  Button,
  Center,
  Heading,
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
            Please sign in using your <Text as="b">Square</Text> Seller account.
          </Text>
          <Button
            colorScheme="blue"
            onClick={handleSignInWithSquare}
            rightIcon={<Icon as={BiCheckboxSquare} boxSize={8} />}
          >
            Sign in with Square
          </Button>
          <Text color="black" fontSize={"md"}>
            Don't have a <Text as="b">Square</Text> account? Don't worry we've
            got you covered 😉.
          </Text>
          <Text color="black" fontSize={"md"}>
            Play with our <Text as="b">ButlerBot</Text> Demo account.
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
