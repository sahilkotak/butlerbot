import { useState, useRef, useEffect } from "react";
import { onSpeechStart, onSpeechEnd } from "./speech-manager.ts";
import { Button } from "react-bootstrap";
import axios from "axios";

const App = () => {
  const [audioReady, setAudioReady] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [userId, setUserId] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.start();
    onSpeechStart();
  };

  const stopRecording = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(audioChunks.current, {
          type: "audio/wav",
        });

        setAudioBlob(recordedBlob);
        setAudioReady(true);

        const processedBlob = await onSpeechEnd(recordedBlob);
        audioChunks.current = [processedBlob]; // Update audioChunks to contain the processed audio
      };

      mediaRecorder.current.stop();
    }
  };

  const getProducts = async () => {
    if (!userId) {
      console.log("No authorization code provided");
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/square/products/?user_id=${userId}`
      );
      console.log(response.data.catalog_items);
    } catch (error) {
      console.log(error.message || "An error occurred while fetching data.");
    }
  };

  const getAuthorizationKey = async () => {
    const client_id = "sandbox-sq0idb-vvZY6w8UoVogVaZ7FbUH9A";
    const scope =
      "ITEMS_READ PAYMENTS_WRITE MERCHANT_PROFILE_READ ORDERS_WRITE ORDERS_READ PAYMENTS_WRITE CUSTOMERS_WRITE CUSTOMERS_READ PAYMENTS_WRITE PAYMENTS_READ PAYMENTS_WRITE PAYMENTS_READ";
    const REDIRECT_URL = "http://localhost:5174/";
    const authorizationUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${REDIRECT_URL}&response_type=code`;
    window.location.href = authorizationUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      window.history.replaceState(null, "", window.location.pathname);
      const fetchTokens = async () => {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/square/authorization/?authorization=${code}`,
            null,
            {
              maxRedirects: 0,
            }
          );
          if (response.data.user_id) {
            setUserId(response.data.user_id);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchTokens();
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {!userId ? (
        <div
          style={{
            padding: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={getAuthorizationKey}
        >
          Authorize Square Account
        </div>
      ) : (
        <div
          style={{
            padding: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={getProducts}
        >
          Get Products
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Button onClick={startRecording}>Start</Button>
        <Button onClick={stopRecording}>End</Button>

        {audioReady && <audio controls src={URL.createObjectURL(audioBlob)} />}
      </div>
    </>
  );
};

export default App;
