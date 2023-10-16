import { Center, Text } from "@chakra-ui/react";

import { useVADRecorder } from "../hooks";
import { RecorderError } from "../components/";
import Chat from "./Chat";

const HomePage = () => {
  const vad = useVADRecorder();

  return (
    <>
      {vad.loading ? (
        <Center>
          <Text color={"black"}>VAD loading...</Text>
        </Center>
      ) : vad.errored ? (
        <Center>
          <RecorderError message={vad.errored.message} />
        </Center>
      ) : vad.userSpeaking ? (
        <Center>
          <Text fontSize="md" color={"black"}>
            User speaking is speaking.
          </Text>
        </Center>
      ) : (
        <Center>
          <Text fontSize="md" color={"black"}>
            VAD is actively listening.
          </Text>
        </Center>
      )}
      <Chat />
    </>
  );
};

export default HomePage;
