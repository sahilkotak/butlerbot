import { useState, useRef } from 'react';
import { onSpeechStart, onSpeechEnd} from "./speech-manager.ts";
import { Button } from 'react-bootstrap';

const App = () => {
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

        mediaRecorder.current.onstop = async () => {
            const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioBlob(blob);
            await onSpeechEnd(blob);
            setAudioReady(true);
        };

        mediaRecorder.current.start();
        onSpeechStart();
    };

    const stopRecording = async () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.onstop = async () => {
                const recordedBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const processedBlob = await onSpeechEnd(recordedBlob);
                setAudioReady(true);
                audioChunks.current = [processedBlob]; // Update audioChunks to contain the processed audio
            };
    
            mediaRecorder.current.stop();
        }
    };
    
    

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
        }}>
            <Button onClick={startRecording}>Start</Button>
            <Button onClick={stopRecording}>End</Button>
            {audioReady && <audio controls src={URL.createObjectURL(audioBlob)} />}
        </div>
    );
}

export default App;
