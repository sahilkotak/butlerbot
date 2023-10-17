"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioNodeVAD = exports.MicVAD = exports.defaultRealTimeVADOptions = void 0;
const ort = __importStar(require("onnxruntime-web"));
const _common_1 = require("./_common");
const model_fetcher_1 = require("./model-fetcher");
const asset_path_1 = require("./asset-path");
const _getWorkletURL = () => {
    return (0, asset_path_1.assetPath)("vad.worklet.bundle.min.js");
};
exports.defaultRealTimeVADOptions = {
    ..._common_1.defaultFrameProcessorOptions,
    onFrameProcessed: (probabilities) => { },
    onVADMisfire: () => {
        _common_1.log.debug("VAD misfire");
    },
    onSpeechStart: () => {
        _common_1.log.debug("Detected speech start");
    },
    onSpeechEnd: () => {
        _common_1.log.debug("Detected speech end");
    },
    workletURL: _getWorkletURL(),
    stream: undefined,
};
class MicVAD {
    static async new(options = {}) {
        const vad = new MicVAD({ ...exports.defaultRealTimeVADOptions, ...options });
        await vad.init();
        return vad;
    }
    constructor(options) {
        this.options = options;
        this.listening = false;
        this.init = async () => {
            if (this.options.stream === undefined)
                this.stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        ...this.options.additionalAudioConstraints,
                        channelCount: 1,
                        echoCancellation: true,
                        autoGainControl: true,
                        noiseSuppression: true,
                    },
                });
            else
                this.stream = this.options.stream;
            this.audioContext = new AudioContext();
            const source = new MediaStreamAudioSourceNode(this.audioContext, {
                mediaStream: this.stream,
            });
            this.audioNodeVAD = await AudioNodeVAD.new(this.audioContext, this.options);
            this.audioNodeVAD.receive(source);
        };
        this.pause = () => {
            this.audioNodeVAD.pause();
            this.listening = false;
        };
        this.start = () => {
            this.audioNodeVAD.start();
            this.listening = true;
        };
        (0, _common_1.validateOptions)(options);
    }
}
exports.MicVAD = MicVAD;
class AudioNodeVAD {
    static async new(ctx, options = {}) {
        const vad = new AudioNodeVAD(ctx, {
            ...exports.defaultRealTimeVADOptions,
            ...options,
        });
        await vad.init();
        return vad;
    }
    constructor(ctx, options) {
        this.ctx = ctx;
        this.options = options;
        this.pause = () => {
            this.frameProcessor.pause();
        };
        this.start = () => {
            this.frameProcessor.resume();
        };
        this.receive = (node) => {
            node.connect(this.entryNode);
        };
        this.processFrame = async (frame) => {
            const { probs, msg, audio } = await this.frameProcessor.process(frame);
            if (probs !== undefined) {
                this.options.onFrameProcessed(probs);
            }
            switch (msg) {
                case _common_1.Message.SpeechStart:
                    this.options.onSpeechStart();
                    break;
                case _common_1.Message.VADMisfire:
                    this.options.onVADMisfire();
                    break;
                case _common_1.Message.SpeechEnd:
                    // @ts-ignore
                    this.options.onSpeechEnd(audio);
                    break;
                default:
                    break;
            }
        };
        this.init = async () => {
            await this.ctx.audioWorklet.addModule(this.options.workletURL);
            const vadNode = new AudioWorkletNode(this.ctx, "vad-helper-worklet", {
                processorOptions: {
                    frameSamples: this.options.frameSamples,
                },
            });
            this.entryNode = vadNode;
            const model = await _common_1.Silero.new(ort, model_fetcher_1.modelFetcher);
            this.frameProcessor = new _common_1.FrameProcessor(model.process, model.reset_state, {
                frameSamples: this.options.frameSamples,
                positiveSpeechThreshold: this.options.positiveSpeechThreshold,
                negativeSpeechThreshold: this.options.negativeSpeechThreshold,
                redemptionFrames: this.options.redemptionFrames,
                preSpeechPadFrames: this.options.preSpeechPadFrames,
                minSpeechFrames: this.options.minSpeechFrames,
            });
            vadNode.port.onmessage = async (ev) => {
                switch (ev.data?.message) {
                    case _common_1.Message.AudioFrame:
                        const buffer = ev.data.data;
                        const frame = new Float32Array(buffer);
                        await this.processFrame(frame);
                        break;
                    default:
                        break;
                }
            };
        };
        (0, _common_1.validateOptions)(options);
    }
}
exports.AudioNodeVAD = AudioNodeVAD;
//# sourceMappingURL=real-time-vad.js.map