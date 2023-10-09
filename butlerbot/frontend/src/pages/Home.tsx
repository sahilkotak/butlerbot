import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { onSpeechStart, onSpeechEnd } from "../utils/speech-manager";

const Home = () => {
  const [audioReady, setAudioReady] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

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
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
      </div>
    </>
  );
};

export default Home;
