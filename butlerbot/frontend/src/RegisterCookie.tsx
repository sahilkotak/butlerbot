import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RegisterCookie = ({ onSessionTokenUpdate }) => {
  const { cookie } = useParams();
  const navigate = useNavigate();

  const setUserSessionCookie = () => {
    const cookieStr = `X-ButlerBot-Active-Session-Token=${cookie};expires=${(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 25); // 25 days ttl
      return expirationDate.toUTCString();
    })()}; SameSite=Lax; path=/`;

    document.cookie = cookieStr;
    onSessionTokenUpdate(cookie);

    navigate("/", { replace: true });
  };

  useEffect(() => {
    setUserSessionCookie();
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
