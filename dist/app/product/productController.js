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
exports.deleteProduct = exports.updateProduct = exports.searchProducts = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const productSchema_1 = require("./productSchema");
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const ValidationError_1 = require("../../utils/ValidationError");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const customError_1 = __importDefault(require("../../middlewares/customError"));
const ErrorCodes_1 = require("../../config/ErrorCodes");
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prismaDb_1.default.product.findMany({
            include: {
                productImage: true,
            },
            // for now i am skipping the paggination as we have not dicussed yet
            // skip: +req.query.skip! || 0,
            // take: 5,
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, products);
    }
    catch (error) {
        return next(error);
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const product = yield prismaDb_1.default.product.findUnique({
            where: {
                id,
            },
        });
        if (!product) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "Product not found with id" + id);
        }
        (0, ResponseMessage_1.ResponseMessage)(res, 200, product);
    }
    catch (error) {
        return next(error);
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, stock, categoryId, subCategoryId } = req.body;
    const productImage = req.files;
    const data = {
        name,
        price: parseInt(price),
        description,
        stock: Number(stock),
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),
    };
    try {
        const validateDate = productSchema_1.productSchema.safeParse(data);
        if (!validateDate.success) {
            return (0, ValidationError_1.ValidationError)(validateDate, res);
        }
        const product = yield prismaDb_1.default.product.create({
            data: Object.assign(Object.assign({}, data), { tags: "name" }),
        });
        productImage.map((it) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prismaDb_1.default.productImages.create({
                data: {
                    image: it.fieldname,
                    productId: product.id,
                },
            });
        }));
        (0, ResponseMessage_1.ResponseMessage)(res, 200, data);
    }
    catch (error) {
        return next(error);
    }
});
exports.createProduct = createProduct;
const searchProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prismaDb_1.default.product.findMany({
            include: {
                productImage: true,
            },
            where: {
                name: {
                    contains: req.query.query.toString(),
                },
                // comenting for future use
                // name: {
                //   search: req.query.query!.toString(),
                // },
                // description: {
                //   search: req.query.query!.toString(),
                // },
                // tags: {
                //   search: req.query.query!.toString(),
                // },
            },
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, products);
    }
    catch (error) {
        return next(error);
    }
});
exports.searchProducts = searchProducts;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    const id = Number(req.params.id);
    try {
        const findProduct = yield prismaDb_1.default.product.findUnique({
            where: { id },
        });
        if (!findProduct) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.PRODUCT_NOT_FOUND, "Product not found with id " + id);
        }
        if (product.tags) {
            product.tags = product.tags.join(",");
        }
        const updateProduct = yield prismaDb_1.default.product.update({
            where: {
                id: +req.params.id,
            },
            data: product,
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "product updated successfully");
    }
    catch (error) {
        return next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const findProduct = yield prismaDb_1.default.product.findUnique({
            where: { id },
        });
        if (!findProduct) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "Product not found with id " + id);
        }
        const deleteProduct = yield prismaDb_1.default.product.delete({ where: { id } });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "product deleted successfully");
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteProduct = deleteProduct;
