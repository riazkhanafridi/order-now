"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(httpStatusCode, message, documentationUrl) {
        if (message) {
            super(message);
        }
        else {
            super("A generic error occurred!");
        }
        // initializing the class properties
        this.httpStatusCode = httpStatusCode;
        this.timestamp = new Date().toISOString();
        this.documentationUrl = documentationUrl;
        // attaching a call stack to the current class,
        // preventing the constructor call to appear in the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = CustomError;
