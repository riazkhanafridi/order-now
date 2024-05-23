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
exports.getUserOrders = exports.changeStatus = exports.getAllOrders = exports.getOrderById = exports.cancelOrder = exports.getAllLoggedInUserOrders = exports.createOrder = void 0;
const ErrorCodes_1 = require("../../config/ErrorCodes");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const customError_1 = __importDefault(require("../../middlewares/customError"));
const orderSchema_1 = require("./orderSchema");
const ValidationError_1 = require("../../utils/ValidationError");
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prismaDb_1.default.$transaction((orderTsx) => __awaiter(void 0, void 0, void 0, function* () {
            const cartItems = yield orderTsx.cartItem.findMany({
                where: {
                    userId: req.user.id,
                },
                include: {
                    product: true,
                },
            });
            if (cartItems.length == 0) {
                return res.json({ message: "cart is empty" });
            }
            const price = cartItems.reduce((prev, current) => {
                return prev + current.quantity * +current.product.price;
            }, 0);
            const address = yield orderTsx.address.findFirst({
                where: {
                    userId: req.user.id,
                    // id: req.user.defaultShippingAddress!,
                },
            });
            const order = yield orderTsx.order.create({
                data: {
                    userId: req.user.id,
                    netAmount: price,
                    address: `${address === null || address === void 0 ? void 0 : address.city} ,${address === null || address === void 0 ? void 0 : address.pincode}`,
                    products: {
                        create: cartItems.map((cart) => {
                            return {
                                productId: cart.productId,
                                quantity: cart.quantity,
                            };
                        }),
                    },
                },
            });
            const orderEvent = yield orderTsx.orderEvent.create({
                data: {
                    orderId: order.id,
                },
            });
            yield orderTsx.cartItem.deleteMany({
                where: {
                    userId: req.user.id,
                },
            });
            return res.json(order);
        }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createOrder = createOrder;
const getAllLoggedInUserOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prismaDb_1.default.order.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                products: true,
            },
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, orders);
    }
    catch (error) {
        return next(error);
    }
});
exports.getAllLoggedInUserOrders = getAllLoggedInUserOrders;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const isOwnOrder = yield prismaDb_1.default.order.findUnique({
            where: { id: req.user.id },
        });
        if (!isOwnOrder) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.ORDER_NOT_FOUND, "you are not able to cancel other's orders");
        }
        return yield prismaDb_1.default.$transaction((cancelOrderTsx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield cancelOrderTsx.order.update({
                where: {
                    id,
                },
                data: {
                    status: "CANCELLED",
                },
            });
            yield cancelOrderTsx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: "CANCELLED",
                },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, order);
        }));
    }
    catch (error) {
        return next(error);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const order = yield prismaDb_1.default.order.findUnique({
            where: { id },
            include: {
                products: true,
                events: true,
            },
        });
        if (!order) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.ORDER_NOT_FOUND, "no data found with id : " + id);
        }
        (0, ResponseMessage_1.ResponseMessage)(res, 200, order);
    }
    catch (error) {
        return next(error);
    }
});
exports.getOrderById = getOrderById;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // all down code commenting for future use
    // const validatedData = orderStatusSchema.safeParse(req.query);
    // if (!validatedData.success) {
    //   return ValidationError(validatedData, res);
    // }
    try {
        const orders = yield prismaDb_1.default.order.findMany({
            // commenting for future use
            // where: {
            //   status: validatedData.data.status,
            // },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                products: true,
            },
            // commenting for future use
            // skip: +req.query.skip! || 0,
            // take: 5,
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, orders);
    }
    catch (error) {
        return next(error);
    }
});
exports.getAllOrders = getAllOrders;
const changeStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const validatedData = orderSchema_1.orderStatusSchema.safeParse(req.body);
    if (!validatedData.success) {
        return (0, ValidationError_1.ValidationError)(validatedData, res);
    }
    try {
        const order = yield prismaDb_1.default.order.findUnique({ where: { id } });
        if (!order) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.ORDER_NOT_FOUND, "no orders found with id " + id);
        }
        return yield prismaDb_1.default.$transaction((changeStatusTrx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield changeStatusTrx.order.update({
                where: {
                    id,
                },
                data: {
                    status: validatedData.data.status,
                },
            });
            yield changeStatusTrx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: validatedData.data.status,
                },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, order);
        }));
    }
    catch (error) {
        return next(error);
    }
});
exports.changeStatus = changeStatus;
const getUserOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const validatedData = orderSchema_1.orderStatusSchema.safeParse(req.body);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const orders = yield prismaDb_1.default.order.findMany({
            where: {
                id,
                status: validatedData.data.status,
            },
            include: {
                products: true,
            },
            // commenting for future use
            // skip: +req.query.skip! || 0,
            // take: 5,
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, orders);
    }
    catch (error) {
        return next(error);
    }
});
exports.getUserOrders = getUserOrders;
