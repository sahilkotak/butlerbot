"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetPath = void 0;
const currentScript = window.document.currentScript;
let basePath = "";
if (currentScript) {
    basePath = currentScript.src
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/");
}
const assetPath = (file) => {
    return basePath + file;
};
exports.assetPath = assetPath;
//# sourceMappingURL=asset-path.js.map