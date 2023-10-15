// Voice activity detector
import { useEffect, useRef } from "react";
import { useMicVAD } from "@ricky0123/vad-react";

// class SpeechManager {
//   private source: AudioBufferSourceNode;

//   constructor(private sourceIsStarted = false) {}
// }

export const useVADRecorder = (onVADLoaded) => {
  const micVADInstance = useMicVAD({
    startOnLoad: true, // VAD start listening to mic input when it finishes loading
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.9,
    negativeSpeechThreshold: 0.75,
    onSpeechStart: () => {
      console.log("speech started...");
    },
    onSpeechEnd: (audio) => {
      console.log("speech stoped...", audio);
    },
    minSpeechFrames: 4,
    onVADMisfire: () => {
      // if speech start was detected but onSpeechEnd will not be run because the audio segment is smaller than minSpeechFrames
      console.log("speech misfired...");
    },
  });

  const loading = useRef(micVADInstance.loading);
  console.log("vad initial loaded (useVADRecorder.loading)", loading.current);

  useEffect(() => {
    if (loading.current !== micVADInstance.loading) {
      onVADLoaded(micVADInstance.loading);
      loading.current = micVADInstance.loading;
      console.log("vad loaded (useVADRecorder.loading)", loading.current);
    }
  }, [micVADInstance.loading, onVADLoaded]);

  return micVADInstance;
};

// ignore below code
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
