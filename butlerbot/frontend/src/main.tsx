import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <ChakraProvider toastOptions={{ defaultOptions: { position: "top-right" } }}>
    <App />
  </ChakraProvider>
  // </React.StrictMode>
);
