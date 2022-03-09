"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.removeVideo = exports.remove = exports.uploadToImages = exports.uploadToVideos = exports.getImageLink = exports.getVideoLink = exports.getLink = exports.upload = void 0;
const { Storage } = require('@google-cloud/storage');
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const VIDEO_BUCKET = Application_1.default.env.get('VIDEO_BUCKET', 'music-project-bucket');
const IMAGE_BUCKET = Application_1.default.env.get('IMAGE_BUCKET', 'music-project-images-bucket');
const store = new Storage({
    projectId: 'music-project-341316',
    keyFilename: Application_1.default.makePath('keyfile.json'),
});
const upload = (filePath, destFileName, bucketName) => {
    return store.bucket(bucketName).upload(filePath, {
        destination: destFileName,
    });
};
exports.upload = upload;
const getLink = (bucketName, fileName) => {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};
exports.getLink = getLink;
const getVideoLink = (fileName) => {
    return `https://storage.googleapis.com/${VIDEO_BUCKET}/${fileName}`;
};
exports.getVideoLink = getVideoLink;
const getImageLink = (fileName) => {
    return `https://storage.googleapis.com/${IMAGE_BUCKET}/${fileName}`;
};
exports.getImageLink = getImageLink;
const uploadToVideos = (filePath, destFileName) => {
    return (0, exports.upload)(filePath, destFileName, VIDEO_BUCKET);
};
exports.uploadToVideos = uploadToVideos;
const uploadToImages = (filePath, destFileName) => {
    return (0, exports.upload)(filePath, destFileName, IMAGE_BUCKET);
};
exports.uploadToImages = uploadToImages;
const remove = (bucketName, fileName) => {
    return store.bucket(bucketName).file(fileName).delete();
};
exports.remove = remove;
const removeVideo = (fileName) => {
    return (0, exports.remove)(VIDEO_BUCKET, fileName);
};
exports.removeVideo = removeVideo;
const removeImage = (fileName) => {
    return (0, exports.remove)(IMAGE_BUCKET, fileName);
};
exports.removeImage = removeImage;
//# sourceMappingURL=gcs.js.map