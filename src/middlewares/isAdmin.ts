import { NextFunction, Request, Response } from "express";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user.role == "ADMIN") {
    next();
  } else {
    return res.send("you are not authorized");
  }
};

export default adminMiddleware;
