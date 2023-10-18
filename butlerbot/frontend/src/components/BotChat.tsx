import { Text, Badge, Center, Image, Spinner } from "@chakra-ui/react";
import { BotState } from "../enums";

const BotChat = ({ status }) => {
  return (
    <Center>
      <Image
        src="https://ntibnportal.powerappsportals.com/but.png"
        alt="ButlerBot Icon"
        boxSize={6}
      />
      <Text color={"black"} margin={"10px"}>
        {" "}
        is{" "}
        <Badge
          colorScheme={
            status === BotState.Listening
              ? "yellow"
              : status === BotState.Thinking
              ? "purple"
              : "blue"
          }
        >
          {status === BotState.Listening
            ? "idle"
            : status === BotState.Thinking
            ? "thinking"
            : "listening"}
        </Badge>
      </Text>

      {status === BotState.Thinking && (
        <Spinner
          thickness="2px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          boxSize={5}
        />
      )}
    </Center>
  );
};

export default BotChat;
