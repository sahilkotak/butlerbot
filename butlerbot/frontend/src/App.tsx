// import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// import Error from "./Error";
import RegisterCookie from "./RegisterCookie";
import { Home, Login } from "./pages";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/setup" element={<Error />}>
//       <Route path=":id" element={<RegisterCookie />} />
//     </Route>
//   )
// );

const App = () => {
  // const [userLogInStatus, setUserLoginStatus] = useState(false);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const registerLoggedInUser = () => {
  //   setUserLoginStatus(true);
  // };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/setup/:cookie" element={<RegisterCookie />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
