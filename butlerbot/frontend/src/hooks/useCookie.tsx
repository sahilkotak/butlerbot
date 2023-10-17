import { useState } from "react";

export const useCookie = () => {
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

  const sessionTokenUpdateHandler = (cookie) => {
    const cookieStr = `X-ButlerBot-Active-Session-Token=${cookie};expires=${(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 25); // 25 days ttl
      return expirationDate.toUTCString();
    })()}; SameSite=Lax; path=/`;

    document.cookie = cookieStr;
    setSessionToken(cookie);
  };

  return [sessionToken, sessionTokenUpdateHandler];
};

export const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === cookieName) {
      return cookie[1];
    }
  }

  return null;
};
