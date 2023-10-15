import { useState } from "react";
import { Center, Highlight, Stack, Text } from "@chakra-ui/react";

import { useVADRecorder } from "../hooks";
import { RecorderError } from "../components/";

const HomePage = () => {
  const [isRecorderLoaded, setRecorderLoaded] = useState(false);
  const vad = useVADRecorder(setRecorderLoaded);

  console.log("recorder loaded (isRecorderLoaded): ", isRecorderLoaded);

  if (vad.loading) {
    return (
      <Center minHeight="100vh" backgroundColor={"black"}>
        <Text>VAD Loading...</Text>
      </Center>
    );
  } else if (vad.errored) {
    return (
      <Center minHeight="100vh" backgroundColor={"black"}>
        <RecorderError message={vad.errored.message} />{" "}
      </Center>
    );
  } else {
    return (
      <Center minHeight="100vh" backgroundColor={"black"}>
        <Stack spacing={3} color={"black"}>
          <Text fontSize="md">
            Did the VAD finish loading?{" "}
            <Highlight
              query="spotlight"
              styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
            >
              loading
            </Highlight>
            : {vad.loading}
          </Text>
          <Text fontSize="md">
            Is the VAD currently listening to mic input?{" "}
            <Highlight
              query="spotlight"
              styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
            >
              listening
            </Highlight>
            : {vad.listening}
          </Text>
          <Text fontSize="md">
            Is the user speaking?{" "}
            <Highlight
              query="spotlight"
              styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
            >
              userSpeaking
            </Highlight>
            : {vad.userSpeaking}
          </Text>
        </Stack>
      </Center>
    );
  }
};

export default HomePage;
