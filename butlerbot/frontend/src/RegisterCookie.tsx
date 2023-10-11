import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RegisterCookie = ({ onSessionTokenUpdate }) => {
  const { cookie } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    onSessionTokenUpdate(cookie);

    // redirect to home page
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p>
        Please do not navigate away. Saving connection to your Square Seller
        account...
        <br />
        Cookie: {cookie}
      </p>
    </>
  );
};

export default RegisterCookie;
