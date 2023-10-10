import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RegisterCookie from "./RegisterCookie";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";

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

  // handlers
  const sessionTokenUpdateHandler = (cookie) => {
    const cookieStr = `X-ButlerBot-Active-Session-Token=${cookie};expires=${(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 25); // 25 days ttl
      return expirationDate.toUTCString();
    })()}; SameSite=Lax; path=/`;

    document.cookie = cookieStr;
    setSessionToken(cookie);
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
