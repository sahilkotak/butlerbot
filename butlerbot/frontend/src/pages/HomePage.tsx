import { useState } from "react";
import { Button, Center } from "@chakra-ui/react";

import { RecorderError } from "../components/";
import { useAudioRecorder } from "../hooks";

const HomePage = () => {
  const { startRecording, stopRecording } = useAudioRecorder();
  const [recorderError, setRecorderError] = useState(false);

  return (
    <Center minHeight="100vh">
      {recorderError ? (
        <RecorderError />
      ) : (
        <>
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={async () => {
              try {
                await startRecording();
              } catch (e) {
                setRecorderError(e);
              }
            }}
          >
            Start
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={async () => await stopRecording()}
          >
            Stop
          </Button>
        </>
      )}
    </Center>
  );
};

export default HomePage;
