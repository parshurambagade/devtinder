import { Request } from "express";
import validator from "validator";

export const validateSignupData = (req: Request) => {
  const { firstName, email, password } = req.body;

  if (!firstName) {
    throw new Error("First name is required!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email!");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password!");
  }
};
