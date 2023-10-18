import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { useCookie } from "./hooks";
import { useEffect } from "react";
// import { useEffect, useState } from "react";

const App = () => {
  const [cookie, setCookie] = useCookie();
  // const [isDemoAccount, setIsDemoAccount] = useState(false);
  // useEffect(())
  useEffect(() => {
    setCookie(cookie);
    // eslint-disable-next-line
  }, [cookie]);
  return (
    <Router>
      <Routes>
        <Route
          path="/index.html"
          element={cookie ? <HomePage /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
