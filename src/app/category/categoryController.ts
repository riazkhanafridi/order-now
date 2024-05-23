import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../../utils/ResponseMessage";

import { ValidationError } from "../../utils/ValidationError";
import prismaDb from "../../utils/prismaDb";
import { categorySchema } from "./categorySchema";
import CustomError from "../../middlewares/customError";
import { ErrorCode } from "../../config/ErrorCodes";

export const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prismaDb.category.findMany();
    return ResponseMessage(res, 200, data);
  } catch (error) {
    return next(error);
  }
};

// create Category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryImage = req.file?.filename;

  const data = {
    name: req.body.name,
    image: categoryImage,
  };
  try {
    const validatedData = categorySchema.safeParse(data);
    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const newCategory = await prismaDb.category.create({
      data: validatedData.data,
    });

    return ResponseMessage(res, 200, newCategory);
  } catch (error) {
    return next(error);
  }
};

//  update Category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  const categoryImage = req.file?.filename;

  const data = {
    name: req.body.name,
    image: categoryImage!,
  };

  try {
    const validatedData = categorySchema.safeParse(data);

    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const findCategory = await prismaDb.category.findUnique({ where: { id } });

    if (!findCategory) {
      throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + id);
    } else {
      const updateCategory = await prismaDb.category.update({
        where: { id: id },
        data: {
          name: validatedData.data.name,
          // image: validatedData.data.image,
        },
      });
      ResponseMessage(res, 200, undefined, "data updated successfully");
    }
  } catch (error) {
    return next(error);
  }
};

//Delete Category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const category = await prismaDb.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + id);
    } else {
      const deleteData = await prismaDb.category.delete({
        where: { id: id },
      });
      return ResponseMessage(res, 200, undefined, "data deleted successfully");
    }
  } catch (error) {
    return next(error);
  }
};
