import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../config/ErrorCodes";
import * as jwt from "jsonwebtoken";
import prismaDb from "../utils/prismaDb";
import CustomError from "./customError";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. extract the token from header
  const token = req.headers.token;

  if (!token) {
    throw new CustomError(ErrorCode.NOT_FOUND, "no data found with id " + "id");
  }
  try {
    const verifyToken = jwt.verify(
      token as any,
      process.env.SECRETE_KEY!
    ) as any;
    const user = await prismaDb.user.findUnique({
      where: { id: verifyToken.id },
    });
    if (!user) {
      throw new CustomError(
        ErrorCode.NOT_FOUND,
        "no data found with id " + "id"
      );
    }
    req.user = user!;
    next();
  } catch (error) {
    return next(error);
  }
};

export default authMiddleware;
