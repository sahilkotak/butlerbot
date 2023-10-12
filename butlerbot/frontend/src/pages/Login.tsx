import { Button } from "react-bootstrap";

const Login = () => {
  return (
    <>
      <Button
        onClick={() => {
          // eslint-disable-next-line no-undef
          if (!process.env.BUTLERBOT_API_ENDPOINT) {
            alert(
              "Application not configured properly. Missing required configurations - BUTLERBOT_API_ENDPOINT."
            );

            return;
          }

          // eslint-disable-next-line no-undef
          window.location.href = `${process.env.BUTLERBOT_API_ENDPOINT}/authorise`;
        }}
      >
        Square Login
      </Button>
    </>
  );
};

export default Login;