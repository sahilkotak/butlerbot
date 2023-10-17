import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { useCookie } from "./hooks";
import { useState } from "react";

const App = () => {
  const [cookie, setCookie] = useCookie();
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/index.html"
          element={
            cookie || isDemoAccount ? (
              <HomePage />
            ) : (
              <LoginPage
                onSessionTokenUpdate={setCookie}
                setIsDemoAccount={setIsDemoAccount}
              />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
