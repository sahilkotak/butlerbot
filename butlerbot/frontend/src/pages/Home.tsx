import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

import { onSpeechStart, onSpeechEnd } from "../utils/speech-manager";

const Home = () => {
  const [audioReady, setAudioReady] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  // test checkout item
  const testCheckoutData = [
    {
      catalog_object_id: "QQZ6ZOA3IUB2HFAHW7W7GVAP",
      quantity: "1",
    },
    {
      catalog_object_id: "UF4L33R6F3QDZAKWCS4E3C64",
      quantity: "1",
    },
    // {
    //   catalog_object_id: "USQKUYCDTPSIMD4MTKT7R44T",
    //   quantity: "1",
    // },
    // {
    //   catalog_object_id: "YDVHZOMBDTTFTDTOBSVDACM5",
    //   quantity: "1",
    // },
  ];

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

  const handleCheckOut = async () => {
    const getCookieValue = (cookieName) => {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === cookieName) {
          return cookie[1];
        }
      }
      return null;
    };

    // Get session token from cookie
    const sessionToken = getCookieValue("X-ButlerBot-Active-Session-Token");

    if (sessionToken) {
      try {
        const response = await axios.post(
          `${process.env.BUTLERBOT_API_ENDPOINT}/checkout`,
          {
            data: testCheckoutData,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          window.location.href = response.data.payment_link;
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Session Token not found.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div>
          <Link to="/login">Login</Link>
          <Link to="/setup/AADK124243432">Setup Cookie</Link>
        </div>

        <div>
          <Button onClick={startRecording}>Start</Button>
          <Button onClick={stopRecording}>End</Button>

          {audioReady && (
            <audio controls src={URL.createObjectURL(audioBlob)} />
          )}
        </div>
        <button
          onClick={handleCheckOut}
          style={{
            background: "#000",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px 40px",
            borderRadius: "8px",
            marginTop: "20px",
            fontSize: "20px",
          }}
        >
          Proceed to Payment
        </button>
      </div>
    </>
  );
};

export default Home;
