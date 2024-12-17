import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;

    const token = await jwt.verify(cookies.token, "secret");
    console.log("Token: ", token);

    if (!token) throw new Error("Invalid Token!");

    const user = await User.findById(token);
    console.log("User: ", user);

    if (!user) throw new Error("User not found!");

    req.body.user = user;

    next();
  } catch (err: any) {
    res.status(400).send("Error: " + err.message);
  }
};
