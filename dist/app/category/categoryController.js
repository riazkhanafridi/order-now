"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategory = void 0;
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const ValidationError_1 = require("../../utils/ValidationError");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const categorySchema_1 = require("./categorySchema");
const customError_1 = __importDefault(require("../../middlewares/customError"));
const ErrorCodes_1 = require("../../config/ErrorCodes");
const getAllCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prismaDb_1.default.category.findMany();
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, data);
    }
    catch (error) {
        return next(error);
    }
});
exports.getAllCategory = getAllCategory;
// create Category
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const categoryImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const data = {
        name: req.body.name,
        image: categoryImage,
    };
    try {
        const validatedData = categorySchema_1.categorySchema.safeParse(data);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const newCategory = yield prismaDb_1.default.category.create({
            data: validatedData.data,
        });
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, newCategory);
    }
    catch (error) {
        return next(error);
    }
});
exports.createCategory = createCategory;
//  update Category
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = Number(req.params.id);
    const categoryImage = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
    const data = {
        name: req.body.name,
        image: categoryImage,
    };
    try {
        const validatedData = categorySchema_1.categorySchema.safeParse(data);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const findCategory = yield prismaDb_1.default.category.findUnique({ where: { id } });
        if (!findCategory) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with id " + id);
        }
        else {
            const updateCategory = yield prismaDb_1.default.category.update({
                where: { id: id },
                data: {
                    name: validatedData.data.name,
                    // image: validatedData.data.image,
                },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data updated successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.updateCategory = updateCategory;
//Delete Category
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const category = yield prismaDb_1.default.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with id " + id);
        }
        else {
            const deleteData = yield prismaDb_1.default.category.delete({
                where: { id: id },
            });
            return (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data deleted successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteCategory = deleteCategory;
