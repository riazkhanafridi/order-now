import { NextFunction, Request, Response } from "express";

import { ErrorCode } from "../../config/ErrorCodes";
import prismaDb from "../../utils/prismaDb";
import { ResponseMessage } from "../../utils/ResponseMessage";
import CustomError from "../../middlewares/customError";
import { orderStatusSchema } from "./orderSchema";
import { ValidationError } from "../../utils/ValidationError";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return await prismaDb.$transaction(async (orderTsx) => {
      const cartItems = await orderTsx.cartItem.findMany({
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

      const address = await orderTsx.address.findFirst({
        where: {
          userId: req.user.id,
          // id: req.user.defaultShippingAddress!,
        },
      });

      const order = await orderTsx.order.create({
        data: {
          userId: req.user.id,
          netAmount: price,
          address: `${address?.city!} ,${address?.pincode}`,
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

      const orderEvent = await orderTsx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      await orderTsx.cartItem.deleteMany({
        where: {
          userId: req.user.id,
        },
      });
      return res.json(order);
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllLoggedInUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prismaDb.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        products: true,
      },
    });
    ResponseMessage(res, 200, orders);
  } catch (error) {
    return next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const isOwnOrder = await prismaDb.order.findFirst({
      where: { userId: req.user.id },
    });
    if (!isOwnOrder) {
      throw new CustomError(
        ErrorCode.ORDER_NOT_FOUND,
        "you are not able to cancel other's orders"
      );
    }

    return await prismaDb.$transaction(async (cancelOrderTsx) => {
      const order = await cancelOrderTsx.order.update({
        where: {
          id,
        },
        data: {
          status: "CANCELLED",
        },
      });
      await cancelOrderTsx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });
      ResponseMessage(res, 200, order);
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const order = await prismaDb.order.findUnique({
      where: { id },
      include: {
        products: true,
        events: true,
      },
    });
    if (!order) {
      throw new CustomError(
        ErrorCode.ORDER_NOT_FOUND,
        "no data found with id : " + id
      );
    }
    ResponseMessage(res, 200, order);
  } catch (error) {
    return next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // all down code commenting for future use
  // const validatedData = orderStatusSchema.safeParse(req.query);
  // if (!validatedData.success) {
  //   return ValidationError(validatedData, res);
  // }

  try {
    const orders = await prismaDb.order.findMany({
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
    ResponseMessage(res, 200, orders);
  } catch (error) {
    return next(error);
  }
};

export const changeStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  const validatedData = orderStatusSchema.safeParse(req.body);
  if (!validatedData.success) {
    return ValidationError(validatedData, res);
  }

  try {
    const order = await prismaDb.order.findUnique({ where: { id } });

    if (!order) {
      throw new CustomError(
        ErrorCode.ORDER_NOT_FOUND,
        "no orders found with id " + id
      );
    }
    return await prismaDb.$transaction(async (changeStatusTrx) => {
      const order = await changeStatusTrx.order.update({
        where: {
          id,
        },
        data: {
          status: validatedData.data.status,
        },
      });

      await changeStatusTrx.orderEvent.create({
        data: {
          orderId: order.id,
          status: validatedData.data.status,
        },
      });

      ResponseMessage(res, 200, order);
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const validatedData = orderStatusSchema.safeParse(req.body);
    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const orders = await prismaDb.order.findMany({
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
    ResponseMessage(res, 200, orders);
  } catch (error) {
    return next(error);
  }
};
