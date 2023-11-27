import { Response, NextFunction } from "express";
import { RequestBody } from "../middlewares/authenticate";

type Func = (
  req: RequestBody,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * AsyncHandler takes a function as an argument.
 * Returns a new function that takes req, res and next.
 * And then invokes the provided 'func' and handle any potential errors using 'catch'.
 */
const asyncHandler = (func: Func) => {
  return (req: RequestBody, res: Response, next: NextFunction) =>
    func(req, res, next).catch((error) => {
      console.log(error);
      let statusCode = 500;
      let errorMessage = error instanceof Error ? error.message : "Server Error";
      return res.status(statusCode).json({ message: errorMessage });
    });
};

export default asyncHandler;
