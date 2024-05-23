"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
//for future use
// type BodyProp={
//     success:boolean,
//     error:{
//         issues:IssueProps
//     }
// }
const ValidationError = (body, res) => {
    var _a;
    return res.status(403).json({
        status: "fail",
        message: (_a = body === null || body === void 0 ? void 0 : body.error.issues) === null || _a === void 0 ? void 0 : _a.map((it) => {
            return `${it.path} : ${it.message}`;
        }),
    });
};
exports.ValidationError = ValidationError;
