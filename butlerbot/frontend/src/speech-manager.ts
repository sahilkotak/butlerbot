let source: AudioBufferSourceNode;
let sourceIsStarted = false;
const conversationThusFar = [];

export const onSpeechStart = () => {
  console.log("speech started");
  stopSourceIfNeeded();
};

export const onSpeechEnd = async (audio) => {
  console.log("speech ended");
  await processAudio(audio);
};

const stopSourceIfNeeded = () => {
  if (source && sourceIsStarted) {
    source.stop(0);
    sourceIsStarted = false;
  }
};

const processAudio = async (audio) => {
  const blob = createAudioBlob(audio);
  await validate(blob);
  sendData(blob);
};

const createAudioBlob = (audio) => {
  const wavBuffer = audio;
  return new Blob([wavBuffer], { type: "audio/wav" });
};

const sendData = (blob) => {
  console.log("sending data");
  fetch("inference", {
    method: "POST",
    body: createBody(blob),
    headers: {
      conversation: base64Encode(JSON.stringify(conversationThusFar)),
    },
  })
    .then(handleResponse)
    .then(handleSuccess)
    .catch(handleError);
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
  if (!res.ok) {
    return res.text().then((error) => {
      throw new Error(error);
    });
  }

  const newMessages = JSON.parse(base64Decode(res.headers.get("text")));
  conversationThusFar.push(...newMessages);
  const blob = await res.blob();
  handleSuccess(blob);
  return blob;
};

const createBody = (data) => {
  const formData = new FormData();
  formData.append("audio", data, "audio.wav");
  return formData;
};

export const handleSuccess = async (blob: Blob) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  stopSourceIfNeeded();

  source = audioContext.createBufferSource();
  source.buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
  source.connect(audioContext.destination);
  source.start(0);
  sourceIsStarted = true;

  return blob; // Return the blob for App.tsx to use
};

const handleError = (error) => {
  console.log(`error encountered: ${error.message}`);
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
