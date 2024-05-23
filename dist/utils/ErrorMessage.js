"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
const ErrorMessage = (res, error, status) => {
    res.status(status).json({
        status: "fail",
        message: error,
    });
};
exports.ErrorMessage = ErrorMessage;
