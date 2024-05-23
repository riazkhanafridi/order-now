"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = void 0;
const ResponseMessage = (res, status, data, message) => {
    res.status(status).json({
        status: "success",
        length: data === null || data === void 0 ? void 0 : data.length,
        message,
        data,
    });
};
exports.ResponseMessage = ResponseMessage;
