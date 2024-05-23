import { NextFunction, Request, Response } from "express";

import { subCategorySchema } from "./subCategorySchema";

import { ResponseMessage } from "../../utils/ResponseMessage";
import { ValidationError } from "../../utils/ValidationError";
import prismaDb from "../../utils/prismaDb";
import CustomError from "../../middlewares/customError";
import { ErrorCode } from "../../config/ErrorCodes";

export const getAllSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prismaDb.subCategory.findMany();
    return ResponseMessage(res, 200, data);
  } catch (error) {
    return next(error);
  }
};

// create subCategory
export const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, categoryId } = req.body;

  const data = {
    name,
    categoryId,
  };

  try {
    const validatedData = subCategorySchema.safeParse(data);
    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const findCategory = await prismaDb.category.findUnique({
      where: { id: validatedData.data.categoryId },
    });

    if (!findCategory) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "no data found with category id  " + validatedData.data.categoryId
      );
    }

    const newSubCategory = await prismaDb.subCategory.create({
      data: validatedData.data,
    });
    return ResponseMessage(res, 200, newSubCategory);
  } catch (error) {
    return next(error);
  }
};

//  update SubCategory
export const updateSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, categoryId } = req.body;
  const id = Number(req.params.id);

  const data = {
    name,
    categoryId,
  };

  try {
    const validatedData = subCategorySchema.safeParse(data);

    if (!validatedData.success) {
      return ValidationError(validatedData, res);
    }

    const findCategory = await prismaDb.category.findUnique({
      where: { id: validatedData.data.categoryId },
    });

    if (!findCategory) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "no data found with category id  " + validatedData.data.categoryId
      );
    }

    const findSubCategory = await prismaDb.subCategory.findUnique({
      where: { id },
    });

    if (!findSubCategory) {
      throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + id);
    } else {
      const updateSubCategory = await prismaDb.subCategory.update({
        where: { id: id },
        data: {
          name: validatedData.data.name,
          categoryId: validatedData.data.categoryId,
        },
      });
      return ResponseMessage(res, 200, undefined, "data updated successfully");
    }
  } catch (error) {
    return next(error);
  }
};

//Delete subCategory
export const deleteSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const subCategory = await prismaDb.subCategory.findUnique({
      where: { id },
    });

    if (!subCategory) {
      throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + id);
    } else {
      const deleteData = await prismaDb.subCategory.delete({
        where: { id: id },
      });
      return ResponseMessage(res, 200, undefined, "data deleted successfully");
    }
  } catch (error) {
    return next(error);
  }
};
