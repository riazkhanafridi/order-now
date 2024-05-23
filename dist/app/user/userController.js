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
exports.deleteShopKeeper = exports.updateShopKeeper = exports.loginUser = exports.updateShopKeeperStatus = exports.createShopKeeper = exports.getShopkeeperByStatus = exports.getAllShopKeepers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = require("./userSchema");
const ValidationError_1 = require("../../utils/ValidationError");
const ResponseMessage_1 = require("../../utils/ResponseMessage");
const prismaDb_1 = __importDefault(require("../../utils/prismaDb"));
const customError_1 = __importDefault(require("../../middlewares/customError"));
const ErrorCodes_1 = require("../../config/ErrorCodes");
const getAllShopKeepers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prismaDb_1.default.user.findMany();
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, data);
    }
    catch (error) {
        return next(error);
    }
});
exports.getAllShopKeepers = getAllShopKeepers;
// get  users by status (approve reject pending)
const getShopkeeperByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = userSchema_1.updateShopKeeperStatusSchema.safeParse(req.body);
    if (!validation.success) {
        return (0, ValidationError_1.ValidationError)(validation, res);
    }
    try {
        const data = yield prismaDb_1.default.user.findMany({
            where: {
                status: req.body.status,
            },
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, data);
    }
    catch (error) {
        return next(error);
    }
});
exports.getShopkeeperByStatus = getShopkeeperByStatus;
const createShopKeeper = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, businessName, address, phoneNo, role } = req.body;
        const files = req.files;
        const shopImage = files === null || files === void 0 ? void 0 : files.image[0].filename;
        const frontImage = files === null || files === void 0 ? void 0 : files.nicFront[0].filename;
        const backImage = files === null || files === void 0 ? void 0 : files.nicBack[0].filename;
        const hashPassword = yield bcrypt_1.default.hash(password, 12);
        const shopkeeperBodyData = {
            name,
            role,
            email,
            phoneNo,
            businessName,
            image: shopImage,
            defaultBillingAddress: Number(address),
            nicFront: frontImage,
            nicBack: backImage,
            password: hashPassword,
        };
        // Validate input using zod schema
        const validatedData = userSchema_1.shopKeeperSchema.safeParse(shopkeeperBodyData);
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const createdShopkeeper = yield prismaDb_1.default.user.create({
            data: shopkeeperBodyData,
        });
        return (0, ResponseMessage_1.ResponseMessage)(res, 200, createdShopkeeper);
    }
    catch (error) {
        return next(error);
    }
});
exports.createShopKeeper = createShopKeeper;
//update shopkeeper status
const updateShopKeeperStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const id = Number(req.params.id);
    const validation = userSchema_1.updateShopKeeperStatusSchema.safeParse(req.body);
    try {
        if (!validation.success)
            return (0, ValidationError_1.ValidationError)(validation, res);
        const shopKeeper = yield prismaDb_1.default.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!shopKeeper) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "data not found with id " + id);
        }
        const updateData = yield prismaDb_1.default.user.update({
            where: { id: Number(req.params.id) },
            data: { status },
        });
        (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data updated successfully");
    }
    catch (error) {
        return next(error);
    }
});
exports.updateShopKeeperStatus = updateShopKeeperStatus;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    const validatedData = userSchema_1.loginUserSchema.safeParse(req.body);
    try {
        if (!validatedData.success) {
            return (0, ValidationError_1.ValidationError)(validatedData, res);
        }
        const shopKeeper = yield prismaDb_1.default.user.findUnique({
            where: { email, role },
        });
        if (!shopKeeper) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.UNAUTHORIZED, "wrong credentials");
        }
        if (shopKeeper.status !== "APPROVE") {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.UNAUTHORIZED, "not approved yet");
        }
        const comparePassword = yield bcrypt_1.default.compare(password, shopKeeper.password);
        if (!comparePassword) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.UNAUTHORIZED, "wrong credentials");
        }
        const token = jsonwebtoken_1.default.sign({ id: shopKeeper.id }, process.env.SECRETE_KEY, { expiresIn: "30d" });
        res.status(200).json({ data: shopKeeper, token });
    }
    catch (error) {
        return next(error);
    }
});
exports.loginUser = loginUser;
const updateShopKeeper = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { name, email, password, status, businessName, phoneNo, role } = req.body;
    const files = req.files;
    if (!(files === null || files === void 0 ? void 0 : files.image) || !(files === null || files === void 0 ? void 0 : files.nicBack) || !(files === null || files === void 0 ? void 0 : files.nicFront)) {
        throw new customError_1.default(ErrorCodes_1.ErrorCode.UNAUTHORIZED, "please select image");
    }
    const shopImage = files === null || files === void 0 ? void 0 : files.image[0].filename;
    const frontImage = files === null || files === void 0 ? void 0 : files.nicFront[0].filename;
    const backImage = files === null || files === void 0 ? void 0 : files.nicBack[0].filename;
    const updateShopkeeperData = {
        name,
        role,
        password,
        email,
        phoneNo,
        businessName,
        status,
        image: shopImage,
        nicFront: frontImage,
        nicBack: backImage,
    };
    try {
        // const validatedData = shopKeeperSchema.safeParse(updateShopkeeperData);
        // if (!validatedData.success) {
        //   return ValidationError(validatedData, res);
        // }
        const findShop = yield prismaDb_1.default.user.findUnique({
            where: { id: id },
        });
        if (!findShop) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "no data found with id " + id);
        }
        else {
            const updateShop = yield prismaDb_1.default.user.update({
                where: { id: id },
                data: updateShopkeeperData,
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data updated successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.updateShopKeeper = updateShopKeeper;
//Delete Category
const deleteShopKeeper = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const deletedData = yield prismaDb_1.default.user.findUnique({ where: { id } });
        if (!deletedData) {
            throw new customError_1.default(ErrorCodes_1.ErrorCode.NOT_FOUND, "data not found");
        }
        else {
            const deleteData = yield prismaDb_1.default.user.delete({
                where: { id: id },
            });
            (0, ResponseMessage_1.ResponseMessage)(res, 200, undefined, "data deleted successfully");
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteShopKeeper = deleteShopKeeper;
