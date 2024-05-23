import { NextFunction, Request, Response } from "express";

import { productSchema } from "./productSchema";

import { ResponseMessage } from "../../utils/ResponseMessage";
import { ValidationError } from "../../utils/ValidationError";
import prismaDb from "../../utils/prismaDb";
import CustomError from "../../middlewares/customError";
import { ErrorCode } from "../../config/ErrorCodes";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prismaDb.product.findMany({
      include: {
        productImage: true,
      },
      // for now i am skipping the paggination as we have not dicussed yet
      // skip: +req.query.skip! || 0,
      // take: 5,
    });
    ResponseMessage(res, 200, products);
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const product = await prismaDb.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "Product not found with id" + id
      );
    }

    ResponseMessage(res, 200, product);
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price, description, stock, categoryId, subCategoryId } =
    req.body;

  const productImage = req.files as Express.Multer.File[];
  const data = {
    name,
    price: parseInt(price),
    description,
    stock: Number(stock),
    categoryId: Number(categoryId),
    subCategoryId: Number(subCategoryId),
  };
  try {
    const validateDate = productSchema.safeParse(data);
    if (!validateDate.success) {
      return ValidationError(validateDate, res);
    }
    const product = await prismaDb.product.create({
      data: {
        ...data,
        tags: "name",
      },
    });
    productImage.map(
      async (it: Express.Multer.File) =>
        await prismaDb.productImages.create({
          data: {
            image: it.fieldname,
            productId: product.id,
          },
        })
    );
    ResponseMessage(res, 200, data);
  } catch (error) {
    return next(error);
  }
};
export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prismaDb.product.findMany({
      include: {
        productImage: true,
      },
      where: {
        name: {
          contains: req.query.query!.toString(),
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
    ResponseMessage(res, 200, products);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = req.body;
  const id = Number(req.params.id);
  try {
    const findProduct = await prismaDb.product.findUnique({
      where: { id },
    });

    if (!findProduct) {
      throw new CustomError(
        ErrorCode.PRODUCT_NOT_FOUND,
        "Product not found with id " + id
      );
    }

    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updateProduct = await prismaDb.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    ResponseMessage(res, 200, undefined, "product updated successfully");
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  try {
    const findProduct = await prismaDb.product.findUnique({
      where: { id },
    });

    if (!findProduct) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "Product not found with id " + id
      );
    }
    const deleteProduct = await prismaDb.product.delete({ where: { id } });
    ResponseMessage(res, 200, undefined, "product deleted successfully");
  } catch (error) {
    return next(error);
  }
};
