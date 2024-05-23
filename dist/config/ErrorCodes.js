"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // will change these codes latter
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 101] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 102] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["INCORRECT_PASSWORD"] = 103] = "INCORRECT_PASSWORD";
    ErrorCode[ErrorCode["ADDRESS_NOT_FOUND"] = 104] = "ADDRESS_NOT_FOUND";
    ErrorCode[ErrorCode["ADDRESS_DOES_NOT_BELONG"] = 105] = "ADDRESS_DOES_NOT_BELONG";
    ErrorCode[ErrorCode["UNPROCESSABLE_ENTITY"] = 201] = "UNPROCESSABLE_ENTITY";
    ErrorCode[ErrorCode["INTERNAL_EXCEPTION"] = 301] = "INTERNAL_EXCEPTION";
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["PRODUCT_NOT_FOUND"] = 501] = "PRODUCT_NOT_FOUND";
    ErrorCode[ErrorCode["ORDER_NOT_FOUND"] = 601] = "ORDER_NOT_FOUND";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// commenting for future use
// { '100': 'Continue',
//   '101': 'Switching Protocols',
//   '102': 'Processing',
//   '200': 'OK',
//   '201': 'Created',
//   '202': 'Accepted',
//   '203': 'Non-Authoritative Information',
//   '204': 'No Content',
//   '205': 'Reset Content',
//   '206': 'Partial Content',
//   '207': 'Multi-Status',
//   '300': 'Multiple Choices',
//   '301': 'Moved Permanently',
//   '302': 'Moved Temporarily',
//   '303': 'See Other',
//   '304': 'Not Modified',
//   '305': 'Use Proxy',
//   '307': 'Temporary Redirect',
//   '400': 'Bad Request',
//   '401': 'Unauthorized',
//   '402': 'Payment Required',
//   '403': 'Forbidden',
//   '404': 'Not Found',
//   '405': 'Method Not Allowed',
//   '406': 'Not Acceptable',
//   '407': 'Proxy Authentication Required',
//   '408': 'Request Time-out',
//   '409': 'Conflict',
//   '410': 'Gone',
//   '411': 'Length Required',
//   '412': 'Precondition Failed',
//   '413': 'Request Entity Too Large',
//   '414': 'Request-URI Too Large',
//   '415': 'Unsupported Media Type',
//   '416': 'Requested Range Not Satisfiable',
//   '417': 'Expectation Failed',
//   '418': 'I\'m a teapot',
//   '422': 'Unprocessable Entity',
//   '423': 'Locked',
//   '424': 'Failed Dependency',
//   '425': 'Unordered Collection',
//   '426': 'Upgrade Required',
//   '428': 'Precondition Required',
//   '429': 'Too Many Requests',
//   '431': 'Request Header Fields Too Large',
//   '500': 'Internal Server Error',
//   '501': 'Not Implemented',
//   '502': 'Bad Gateway',
//   '503': 'Service Unavailable',
//   '504': 'Gateway Time-out',
//   '505': 'HTTP Version Not Supported',
//   '506': 'Variant Also Negotiates',
//   '507': 'Insufficient Storage',
//   '509': 'Bandwidth Limit Exceeded',
//   '510': 'Not Extended',
//   '511': 'Network Authentication Required' }
