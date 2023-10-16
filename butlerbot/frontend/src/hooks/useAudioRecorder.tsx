// import { useRef } from "react";

// import {
//   IBlobEvent,
//   IMediaRecorder,
//   MediaRecorder,
//   register,
// } from "extendable-media-recorder";
// import { connect } from "extendable-media-recorder-wav-encoder";
// /* to define custom encoders and
//   here we are using extendable-media-recorder-wav-encoder package
// */

// (async () => {
//   await register(await connect());
// })();

// class RecordAudio {
//   private isPaused = false;
//   private em: DocumentFragment;
//   private recorder?: IMediaRecorder;

//   constructor(private stream: MediaStream) {
//     this.em = document.createDocumentFragment();
//   }

//   pause(): void {
//     this.isPaused = true;
//     this.recorder?.pause();
//   }

//   resume(): void {
//     this.isPaused = false;
//     this.recorder?.resume();
//   }

//   async start(timeslice = 1000) {
//     try {
//       this.recorder = new MediaRecorder(this.stream, {
//         mimeType: "audio/wav",
//       });

//       this.recorder.addEventListener("dataavailable", (e: IBlobEvent) => {
//         /*
//           In each timeslice we will get the data and the e.data is the AudioBuffer
//           Send actual data if not paused, if paused send empty ArrayBuffer
//         */
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const event: any = new Event("dataavailable");
//         event.data = this.isPaused ? new ArrayBuffer(0) : e.data;
//         this.em.dispatchEvent(event);
//       });

//       this.recorder.start(timeslice);
//     } catch (e) {
//       // we can send error event if something went wrong here
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const event: any = new Event("error");
//       event.data = "recorder initialisation error";
//       this.em.dispatchEvent(event);

//       console.log(
//         "error thrown while setting up the recording data layer - ",
//         e
//       );
//     }
//   }

//   stop() {
//     // on stop stop all audio tracks
//     this.recorder?.stop();
//     this.stream?.getAudioTracks().forEach((track) => {
//       this.stream?.removeTrack(track);
//     });
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   addEventListener(event: string, callback: any) {
//     this.em.addEventListener(event, callback);
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   removeEventListener(event: string, callback: any) {
//     this.em.removeEventListener(event, callback);
//   }

//   // disptach events
//   dispatchEvent(event: Event) {
//     this.em.dispatchEvent(event);
//   }
// }

// export const useAudioRecorder = () => {
//   const recorder = useRef<RecordAudio>();

//   const startRecording = async () => {
//     if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
//       throw new Error("device does not support required audio capabilities");

//     try {
//       const constraints = {
//         audio: {
//           echoCancellation: false,
//           noiseSuppression: false,
//         },
//       };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       const recorderInstance = new RecordAudio(stream);
//       recorder.current = recorderInstance;

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       recorderInstance.addEventListener("dataavailable", (event: any) => {
//         console.log(
//           `send ${event.data.size} bytes data steam to your backend...`
//         );
//         const base64Encoded = window.URL.createObjectURL(event.data);
//         console.log(base64Encoded);
//       });

//       recorderInstance.start();
//     } catch (e) {
//       console.log("error thrown while starting recording - ", e);
//       throw e;
//     }
//   };

//   const stopRecording = async () => {
//     if (recorder.current) {
//       recorder.current.removeEventListener("dataavailable", () => {
//         console.log("event listener dataavailable removed");
//         // this.onMediaRecorderData();
//       });
//       recorder.current.stop();
//       recorder.current = undefined;
//     }
//   };

//   return { startRecording, stopRecording };
// };
