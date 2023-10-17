import { utils } from "@ricky0123/vad-react";

let source: AudioBufferSourceNode;
let sourceIsStarted = false;
const conversationThusFar = [];

export const onSpeechStart = () => {
  console.log("speech started");
  stopSourceIfNeeded();
};

export const onSpeechEnd = async (audio) => {
  console.log("speech ended");
  try {
    return await processAudio(audio);
  } catch (e) {
    console.log("error encountered: ", e.message);
  }
};

export const onSpeechMisfire = () => {
  console.log("speech misfired");
};

// helpers
const stopSourceIfNeeded = () => {
  if (source && sourceIsStarted) {
    source.stop(0);
    sourceIsStarted = false;
  }
};
const processAudio = async (audio) => {
  const blob = createAudioBlob(audio);
  await validate(blob);
  return await sendData(blob);
};
const createAudioBlob = (audio) => {
  const wavBuffer = utils.encodeWAV(audio);
  return new Blob([wavBuffer], { type: "audio/wav" });
};
const sendData = async (blob) => {
  console.log("sending data");

  try {
    const inferenceResponse = await fetch("inference", {
      method: "POST",
      body: createBody(blob),
      headers: {
        conversation: base64Encode(JSON.stringify(conversationThusFar)),
      },
    });

    const response = await handleResponse(inferenceResponse);
    return await handleSuccess(response);
  } catch (e) {
    handleError(e);
  }
};
function base64Encode(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return window.btoa(String.fromCharCode(...new Uint8Array(data)));
}
function base64Decode(base64: string) {
  const binaryStr = window.atob(base64);
  const bytes = new Uint8Array(
    [...binaryStr].map((char) => char.charCodeAt(0))
  );
  return new TextDecoder().decode(bytes);
}
const handleResponse = async (res) => {
  console.log("response handling");
  if (!res.ok) {
    return res.text().then((error) => {
      throw new Error(error);
    });
  }

  const newMessage = JSON.parse(base64Decode(res.headers.get("text")));
  conversationThusFar.push(...newMessage);
  const jsonResponse = await res.json();
  console.log(jsonResponse);

  // Convert base64 audio data to blob
  const audioData = jsonResponse.audio_data;
  const audioBlob = await base64ToBlob(audioData, "audio/wav");

  // Log the rest of the JSON response
  console.log(`Created On: ${jsonResponse.createdOn}`);
  console.log(`User Prompt: ${jsonResponse.user_prompt}`);
  console.log(`AI Response: ${jsonResponse.ai_response}`);
  console.log(`Instructions: `, jsonResponse.instructions);

  return { audioBlob, response: jsonResponse };
};
async function base64ToBlob(base64: string, type: string) {
  const response = await fetch(`data:${type};base64,${base64}`);
  const blob = await response.blob();
  return blob;
}
const createBody = (data) => {
  const formData = new FormData();
  formData.append("audio", data, "audio.wav");
  return formData;
};
const handleSuccess = async ({ audioBlob, response }) => {
  console.log("success response handling");
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  stopSourceIfNeeded();

  source = audioContext.createBufferSource();
  source.buffer = await audioContext.decodeAudioData(
    await audioBlob.arrayBuffer()
  );
  source.connect(audioContext.destination);
  source.start(0);
  sourceIsStarted = true;

  return response;
};
const handleError = (error) => {
  console.log(`error response handling: ${error.message}`);
};
const validate = async (data) => {
  const decodedData = await new AudioContext().decodeAudioData(
    await data.arrayBuffer()
  );
  const duration = decodedData.duration;
  const minDuration = 0.4;

  if (duration < minDuration)
    throw new Error(
      `Duration is ${duration}s, which is less than minimum of ${minDuration}s`
    );
};
