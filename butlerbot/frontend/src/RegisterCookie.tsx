import { useParams } from "react-router-dom";

const RegisterCookie = () => {
  const { cookie } = useParams();

  // const setUserSessionCookie = () => {
  //   const cookie = `X-ButlerBot-Active-Session-Token=${c}; expires=${() => {
  //     const expirationDate = new Date();
  //     expirationDate.setDate(expirationDate.getDate() + 20); // 20 days ttl
  //     return expirationDate;
  //   }}; SameSite=Lax; HttpOnly`;

  //   document.cookie = cookie;
  // };

  // useEffect(() => {
  //   // setUserSessionCookie();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
