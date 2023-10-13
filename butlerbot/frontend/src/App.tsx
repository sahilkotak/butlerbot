import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import RegisterCookie from "./pages/RegisterCookie";

const App = () => {
  const [sessionToken, setSessionToken] = useState(
    (() => {
      const cookieName = "X-ButlerBot-Active-Session-Token=";
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == " ") {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(cookieName) == 0) {
          return decodeURIComponent(
            cookie.substring(cookieName.length, cookie.length)
          );
        }
      }
      return "";
    })()
  );

  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days); // Set expiration date in days
    const expires = `expires=${expirationDate.toUTCString()}`;
    const cookieString = `${name}=${value}; ${expires}; SameSite=Lax; path=/`;
    document.cookie = cookieString;
  }

  // handlers
  const sessionTokenUpdateHandler = (cookie) => {
    const [accessToken, locationId, merchantName] = cookie.split("-&-");
    setCookie("X-ButlerBot-Active-Session-Token", accessToken, 1);
    setCookie("merchant_location_id", locationId, 1);
    setCookie("merchant_name", merchantName, 1);

    setSessionToken(accessToken);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              sessionToken ? (
                <Home />
              ) : (
                <LoginPage onSessionTokenUpdate={sessionTokenUpdateHandler} />
              )
            }
          />
          <Route
            path="/setup/:cookie"
            element={
              <RegisterCookie
                onSessionTokenUpdate={sessionTokenUpdateHandler}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
