import { NextFunction, Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "./cartSchema";
import { ErrorCode } from "../../config/ErrorCodes";
import { Product } from "@prisma/client";
import prismaDb from "../../utils/prismaDb";
import CustomError from "../../middlewares/customError";
import { ResponseMessage } from "../../utils/ResponseMessage";
import { ValidationError } from "../../utils/ValidationError";
import { log } from "console";

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedData = CreateCartSchema.safeParse(req.body);
  if (!validatedData.success) {
    return ValidationError(validatedData, res);
  }
  let product: Product;
  try {
    product = await prismaDb.product.findFirstOrThrow({
      where: {
        id: validatedData.data.productId,
      },
    });
  } catch (err) {
    throw new CustomError(ErrorCode.PRODUCT_NOT_FOUND, "Product not found!");
  }
  const cart = await prismaDb.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.data.quantity,
    },
  });
  console.log(cart);
  res.json(cart);
};

export const deleteItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  try {
    const isDeletingOwnCart = await prismaDb.cartItem.findFirst({
      where: { userId: req.user.id },
    });

    if (!isDeletingOwnCart) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "you are not able to delete other's cart item"
      );
    } else {
      await prismaDb.cartItem.delete({
        where: {
          id,
        },
      });
      ResponseMessage(res, 200, undefined, "item deleted from cart");
    }
  } catch (error) {
    next(error);
  }
};

export const changeQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  const validatedData = ChangeQuantitySchema.parse(req.body);
  try {
    const isUpdatingOwnCart = await prismaDb.cartItem.findFirst({
      where: { userId: req.user.id },
    });

    if (!isUpdatingOwnCart) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "you are not able to update other's cart item"
      );
    } else {
      const updatedCart = await prismaDb.cartItem.update({
        where: {
          id,
        },
        data: {
          quantity: validatedData.quantity,
        },
      });

      ResponseMessage(res, 200, updatedCart, "item updated to cart");
    }
    console.log(isUpdatingOwnCart);
  } catch (error) {
    return next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await prismaDb.cartItem.findMany({
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
    ResponseMessage(res, 200, cart, "item updated to cart");
  } catch (error) {
    return next(error);
  }
};
