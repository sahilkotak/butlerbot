import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./Error.tsx";
import { Home, Login, SquareConnectionRegisterer } from "./pages";

const App = () => {
  const [userLogInStatus, setUserLoginStatus] = useState(false);

  const registerLoggedInUser = () => {
    setUserLoginStatus(true);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: !userLogInStatus ? <Login /> : <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "square-setup",
      element: (
        <SquareConnectionRegisterer
          registerUserHandler={registerLoggedInUser}
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
