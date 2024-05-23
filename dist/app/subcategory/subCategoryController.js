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
exports.deleteSubCategory = exports.updateSubCategory = exports.createSubCategory = exports.getAllSubCategory = void 0;
const subCategorySchema_1 = require("./subCategorySchema");
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const ValidationError_1 = require("../../utils/ValidationError");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const customError_1 = __importDefault(require("../../middlewares/customError"));
const ErrorCodes_1 = require("../../config/ErrorCodes");
const getAllSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prismaDb_1.default.subCategory.findMany();
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, data);
    }
    catch (error) {
        return next(error);
    }
});
exports.getAllSubCategory = getAllSubCategory;
// create subCategory
const createSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categoryId } = req.body;
    const data = {
        name,
        categoryId,
    };
    try {
        const validatedData = subCategorySchema_1.subCategorySchema.safeParse(data);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const findCategory = yield prismaDb_1.default.category.findUnique({
            where: { id: validatedData.data.categoryId },
        });
        if (!findCategory) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with category id  " + validatedData.data.categoryId);
        }
        const newSubCategory = yield prismaDb_1.default.subCategory.create({
            data: validatedData.data,
        });
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, newSubCategory);
    }
    catch (error) {
        return next(error);
    }
});
exports.createSubCategory = createSubCategory;
//  update SubCategory
const updateSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categoryId } = req.body;
    const id = Number(req.params.id);
    const data = {
        name,
        categoryId,
    };
    try {
        const validatedData = subCategorySchema_1.subCategorySchema.safeParse(data);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const findCategory = yield prismaDb_1.default.category.findUnique({
            where: { id: validatedData.data.categoryId },
        });
        if (!findCategory) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with category id  " + validatedData.data.categoryId);
        }
        const findSubCategory = yield prismaDb_1.default.subCategory.findUnique({
            where: { id },
        });
        if (!findSubCategory) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with id " + id);
        }
        else {
            const updateSubCategory = yield prismaDb_1.default.subCategory.update({
                where: { id: id },
                data: {
                    name: validatedData.data.name,
                    categoryId: validatedData.data.categoryId,
                },
            });
            return (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data updated successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.updateSubCategory = updateSubCategory;
//Delete subCategory
const deleteSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const subCategory = yield prismaDb_1.default.subCategory.findUnique({
            where: { id },
        });
        if (!subCategory) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with id " + id);
        }
        else {
            const deleteData = yield prismaDb_1.default.subCategory.delete({
                where: { id: id },
            });
            return (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data deleted successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteSubCategory = deleteSubCategory;
