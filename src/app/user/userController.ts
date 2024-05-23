import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  loginUserSchema,
  shopKeeperSchema,
  updateShopKeeperStatusSchema,
} from "./userSchema";

import { ValidationError } from "../../utils/ValidationError";
import { ResponseMessage } from "../../utils/ResponseMessage";
import prismaDb from "../../utils/prismaDb";
import CustomError from "../../middlewares/customError";
import { ErrorCode } from "../../config/ErrorCodes";

export const getAllShopKeepers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prismaDb.user.findMany();

    return ResponseMessage(res, 200, data);
  } catch (error) {
    return next(error);
  }
};

// get  users by status (approve reject pending)
export const getShopkeeperByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = updateShopKeeperStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return ValidationError(validation, res);
  }

  try {
    const data = await prismaDb.user.findMany({
      where: {
        status: req.body.status,
      },
    });
    ResponseMessage(res, 200, data);
  } catch (error) {
    return next(error);
  }
};

export const createShopKeeper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, businessName, address, phoneNo, role } =
      req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const shopImage = files?.image[0].filename;
    const frontImage = files?.nicFront[0].filename;
    const backImage = files?.nicBack[0].filename;

    const hashPassword = await bcrypt.hash(password, 12);

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
    const validatedData = shopKeeperSchema.safeParse(shopkeeperBodyData);
    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const createdShopkeeper = await prismaDb.user.create({
      data: shopkeeperBodyData,
    });

    return ResponseMessage(res, 200, createdShopkeeper);
  } catch (error) {
    return next(error);
  }
};
//update shopkeeper status

export const updateShopKeeperStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const id = Number(req.params.id);
  const validation = updateShopKeeperStatusSchema.safeParse(req.body);
  try {
    if (!validation.success) return ValidationError(validation, res);
    const shopKeeper = await prismaDb.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!shopKeeper) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "data not found with id " + id
      );
    }

    const updateData = await prismaDb.user.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    ResponseMessage(res, 200, undefined, "data updated successfully");
  } catch (error) {
    return next(error);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, role } = req.body;

  const validatedData = loginUserSchema.safeParse(req.body);

  try {
    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const shopKeeper = await prismaDb.user.findUnique({
      where: { email, role },
    });

    if (!shopKeeper) {
      throw new CustomError(ErrorCode.UNAUTHORIZED, "wrong credentials");
    }

    if (shopKeeper.status !== "APPROVE") {
      throw new CustomError(ErrorCode.UNAUTHORIZED, "not approved yet");
    }

    const comparePassword = await bcrypt.compare(password, shopKeeper.password);

    if (!comparePassword) {
      throw new CustomError(ErrorCode.UNAUTHORIZED, "wrong credentials");
    }

    const token = jwt.sign(
      { id: shopKeeper.id },
      process.env.SECRETE_KEY as string,
      { expiresIn: "30d" }
    );

    res.status(200).json({ data: shopKeeper, token });
  } catch (error) {
    return next(error);
  }
};

export const updateShopKeeper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  const { name, email, password, status, businessName, phoneNo, role } =
    req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files?.image || !files?.nicBack || !files?.nicFront) {
    throw new CustomError(ErrorCode.UNAUTHORIZED, "please select image");
  }

  const shopImage = files?.image[0].filename;
  const frontImage = files?.nicFront[0].filename;
  const backImage = files?.nicBack[0].filename;

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

    const findShop = await prismaDb.user.findUnique({
      where: { id: id },
    });

    if (!findShop) {
      throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + id);
    } else {
      const updateShop = await prismaDb.user.update({
        where: { id: id },
        data: updateShopkeeperData,
      });
      ResponseMessage(res, 200, undefined, "data updated successfully");
    }
  } catch (error) {
    return next(error);
  }
};

//Delete Category
export const deleteShopKeeper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const deletedData = await prismaDb.user.findUnique({ where: { id } });
    if (!deletedData) {
      throw new CustomError(ErrorCode.NOT_FOUND, "data not found");
    } else {
      const deleteData = await prismaDb.user.delete({
        where: { id: id },
      });
      ResponseMessage(res, 200, undefined, "data deleted successfully");
    }
  } catch (error) {
    return next(error);
  }
};
