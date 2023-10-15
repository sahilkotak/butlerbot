import { Center, Text } from "@chakra-ui/react";

import { useVADRecorder } from "../hooks";
import { RecorderError } from "../components/";

const HomePage = () => {
  const vad = useVADRecorder();

  if (vad.loading) {
    return (
      <Center minHeight="100vh">
        <Text color={"black"}>VAD loading...</Text>
      </Center>
    );
  } else if (vad.errored) {
    return (
      <Center minHeight="100vh">
        <RecorderError message={vad.errored.message} />{" "}
      </Center>
    );
  } else if (vad.userSpeaking) {
    return (
      <Center minHeight="100vh">
        <Text fontSize="md" color={"black"}>
          User speaking is speaking.
        </Text>
      </Center>
    );
  } else {
    return (
      <Center minHeight="100vh">
        <Text fontSize="md" color={"black"}>
          VAD is actively listening.
        </Text>
      </Center>
    );
  }
};

export default HomePage;
