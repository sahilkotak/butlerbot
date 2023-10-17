import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { useCookie } from "./hooks";

const App = () => {
  const [cookie, setCookie] = useCookie();

  return (
    <Router>
      <Routes>
        <Route
          path="/index.html"
          element={
            cookie ? (
              <HomePage />
            ) : (
              <LoginPage onSessionTokenUpdate={setCookie} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
