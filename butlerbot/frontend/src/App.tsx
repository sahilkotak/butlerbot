import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RegisterCookie from "./RegisterCookie";
import Home from "./pages/Home";
import Login from "./pages/Login";
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

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={sessionToken ? <Home /> : <Login />} />
          <Route
            path="/setup/:cookie"
            element={<RegisterCookie onSessionTokenUpdate={setSessionToken} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
