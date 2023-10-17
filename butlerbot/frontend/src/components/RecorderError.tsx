import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const RecorderError = ({ message }) => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg" color={"black"}>
        Error
      </AlertTitle>
      <AlertDescription maxWidth="sm" color={"black"}>
        {message}. Please give ButlerBot permissions to access your microphone.
      </AlertDescription>
    </Alert>
  );
};

export default RecorderError;
