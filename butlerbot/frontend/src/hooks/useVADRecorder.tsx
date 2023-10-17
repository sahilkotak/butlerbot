// Voice activity detector
import { useMicVAD } from "@ricky0123/vad-react";

import {
  onSpeechEnd,
  onSpeechStart,
  onSpeechMisfire,
} from "../utils/SpeechManager";

export const useVADRecorder = ({ onSpeechEndCallback }) => {
  const micVADInstance = useMicVAD({
    startOnLoad: true, // VAD start listening to mic input when it finishes loading
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.9,
    negativeSpeechThreshold: 0.75,
    onSpeechStart,
    onSpeechEnd: async (audio) => {
      const response = await onSpeechEnd(audio);
      onSpeechEndCallback(response);
    },
    minSpeechFrames: 4,
    onVADMisfire: onSpeechMisfire,
  });

  return micVADInstance;
};

// ignore below code
// class SpeechManager {
//   private source: AudioBufferSourceNode;

//   constructor(
//     private sourceIsStarted = false,
//     private conversationThusFar = []
//   ) {}

//   private stopSourceIfNeeded = (): void => {
//     if (this.source && this.sourceIsStarted) {
//       this.source.stop(0);
//       this.sourceIsStarted = false;
//     }
//   };
//   private base64Encode = (strToEncode: string): string => {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(strToEncode);
//     return window.btoa(String.fromCharCode(...new Uint8Array(data)));
//   };
//   private base64Decode = (base64: string): string => {
//     const binaryStr = window.atob(base64);
//     const bytes = new Uint8Array(
//       [...binaryStr].map((char) => char.charCodeAt(0))
//     );
//     return new TextDecoder().decode(bytes);
//   };

//   onSpeechStart = (): void => {
//     console.log("speech started...");
//     this.stopSourceIfNeeded();
//   };

//   onSpeechEnd = async (audio) => {
//     try {
//       const wavBuffer = utils.encodeWAV(audio);
//       const audioBlob = new Blob([wavBuffer], { type: "audio/wav" });

//       const dataToSend = new FormData();
//       dataToSend.append("audio", audioBlob, "audio.wav");

//       const response = await fetch("inference", {
//         method: "POST",
//         body: dataToSend,
//         headers: {
//           conversation: this.base64Encode(
//             JSON.stringify(this.conversationThusFar)
//           ),
//         },
//       });

//       if (!response.ok) {
//         return response.text().then((error) => {
//           throw new Error(error);
//         });
//       } else {
//         const newMessage = JSON.parse(
//           this.base64Decode(response.headers.get("text"))
//         );
//         this.conversationThusFar.push(...newMessage);
//         return response.blob();
//       }
//     } catch (e) {
//       console.log("error encountered: ", e.message);
//     }
//   };
// }

//   useEffect(() => {
//     const loadVADRecorder = async () => {
//       try {
//         const micVAD = useMicVAD(recorderConfig);

//         await register(await connect());

//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//           const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//           });
//           const mediaRecorder = new MediaRecorder(stream, {
//             mimeType: "audio/wav",
//           });
//           setRecorder(mediaRecorder);
//         }
//       } catch (e) {
//         console.log(
//           "error thrown while setting up the recording data layer - ",
//           e
//         );
//         setError(e);
//         setRecorder(null);
//       }
//     };

//     registerAudioRecorder();
//   }, []);
