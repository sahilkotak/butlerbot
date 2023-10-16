import { SpeechProbabilities, FrameProcessor, FrameProcessorOptions } from "./_common";
interface RealTimeVADCallbacks {
    /** Callback to run after each frame. The size (number of samples) of a frame is given by `frameSamples`. */
    onFrameProcessed: (probabilities: SpeechProbabilities) => any;
    /** Callback to run if speech start was detected but `onSpeechEnd` will not be run because the
     * audio segment is smaller than `minSpeechFrames`.
     */
    onVADMisfire: () => any;
    /** Callback to run when speech start is detected */
    onSpeechStart: () => any;
    /**
     * Callback to run when speech end is detected.
     * Takes as arg a Float32Array of audio samples between -1 and 1, sample rate 16000.
     * This will not run if the audio segment is smaller than `minSpeechFrames`.
     */
    onSpeechEnd: (audio: Float32Array) => any;
}
/**
 * Customizable audio constraints for the VAD.
 * Excludes certain constraints that are set for the user by default.
 */
type AudioConstraints = Omit<MediaTrackConstraints, "channelCount" | "echoCancellation" | "autoGainControl" | "noiseSuppression">;
interface RealTimeVADOptionsWithoutStream extends FrameProcessorOptions, RealTimeVADCallbacks {
    additionalAudioConstraints?: AudioConstraints;
    workletURL: string;
    stream: undefined;
}
interface RealTimeVADOptionsWithStream extends FrameProcessorOptions, RealTimeVADCallbacks {
    stream: MediaStream;
    workletURL: string;
}
export type RealTimeVADOptions = RealTimeVADOptionsWithStream | RealTimeVADOptionsWithoutStream;
export declare const defaultRealTimeVADOptions: RealTimeVADOptions;
export declare class MicVAD {
    options: RealTimeVADOptions;
    audioContext: AudioContext;
    stream: MediaStream;
    audioNodeVAD: AudioNodeVAD;
    listening: boolean;
    static new(options?: Partial<RealTimeVADOptions>): Promise<MicVAD>;
    constructor(options: RealTimeVADOptions);
    init: () => Promise<void>;
    pause: () => void;
    start: () => void;
}
export declare class AudioNodeVAD {
    ctx: AudioContext;
    options: RealTimeVADOptions;
    frameProcessor: FrameProcessor;
    entryNode: AudioNode;
    static new(ctx: AudioContext, options?: Partial<RealTimeVADOptions>): Promise<AudioNodeVAD>;
    constructor(ctx: AudioContext, options: RealTimeVADOptions);
    pause: () => void;
    start: () => void;
    receive: (node: AudioNode) => void;
    processFrame: (frame: Float32Array) => Promise<void>;
    init: () => Promise<void>;
}
export {};
//# sourceMappingURL=real-time-vad.d.ts.map