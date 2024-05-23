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
exports.getCart = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cartSchema_1 = require("./cartSchema");
const ErrorCodes_1 = require("../../config/ErrorCodes");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const customError_1 = __importDefault(require("../../middlewares/customError"));
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const ValidationError_1 = require("../../utils/ValidationError");
const addItemToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cartSchema_1.CreateCartSchema.safeParse(req.body);
    if (!validatedData.success) {
        return (0, ValidationError_1.ValidationError)(validatedData, res);
    }
    let product;
    try {
        product = yield prismaDb_1.default.product.findFirstOrThrow({
            where: {
                id: validatedData.data.productId,
            },
        });
    }
    catch (err) {
        throw new customError_1.default(ErrorCodes_1.ErrorCode.PRODUCT_NOT_FOUND, "Product not found!");
    }
    const cart = yield prismaDb_1.default.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.data.quantity,
        },
    });
    console.log(cart);
    res.json(cart);
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const isDeletingOwnCart = yield prismaDb_1.default.cartItem.findFirst({
            where: { id: req.user.id },
        });
        if (!isDeletingOwnCart) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "you are not able to delete other's cart item");
        }
        else {
            yield prismaDb_1.default.cartItem.delete({
                where: {
                    id,
                },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "item deleted from cart");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const validatedData = cartSchema_1.ChangeQuantitySchema.parse(req.body);
    try {
        const isUpdatingOwnCart = yield prismaDb_1.default.cartItem.findFirst({
            where: { id: req.user.id },
        });
        if (!isUpdatingOwnCart) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "you are not able to update other's cart item");
        }
        else {
            const updatedCart = yield prismaDb_1.default.cartItem.update({
                where: {
                    id,
                },
                data: {
                    quantity: validatedData.quantity,
                },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, updatedCart, "item updated to cart");
        }
        console.log(isUpdatingOwnCart);
    }
    catch (error) {
        return next(error);
    }
});
exports.changeQuantity = changeQuantity;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield prismaDb_1.default.cartItem.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                user: true,
                product: {
                    include: {
                        productImage: {
                            select: {
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, cart, "item updated to cart");
    }
    catch (error) {
        return next(error);
    }
});
exports.getCart = getCart;
