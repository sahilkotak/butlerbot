"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelFetcher = void 0;
const asset_path_1 = require("./asset-path");
const modelFetcher = async () => {
    const modelURL = (0, asset_path_1.assetPath)("silero_vad.onnx");
    return await fetch(modelURL).then((r) => r.arrayBuffer());
};
exports.modelFetcher = modelFetcher;
//# sourceMappingURL=model-fetcher.js.map