"use strict";
// src/middlewares/errorHandling.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
function errorHandler(err, req, res, next) {
    // default HTTP status code and error message
    let httpStatusCode = 500;
    let message = "Internal Server Error";
    // if the error is a custom defined error
    if (err instanceof customError_1.default) {
        httpStatusCode = err.httpStatusCode;
        message = err.message;
    }
    else {
        // hide the detailed error message in production
        // for security reasons
        if (process.env.NODE_ENV !== "production") {
            // since in JavaScript you can also
            // directly throw strings
            if (typeof err === "string") {
                message = err;
            }
            else if (err instanceof Error) {
                message = err.message;
            }
        }
    }
    let stackTrace = undefined;
    // return the stack trace only when
    // developing locally or in stage
    if (process.env.NODE_ENV !== "production") {
        stackTrace = err.stack;
    }
    // logg the error
    console.error(err);
    // other custom behaviors...
    // return the standard error response
    res.status(httpStatusCode).send({
        error: {
            message: message,
            timestamp: err.timestamp || undefined,
            documentationUrl: err.documentationUrl || undefined,
            stackTrace: stackTrace,
        },
    });
    return next(err);
}
exports.default = errorHandler;
