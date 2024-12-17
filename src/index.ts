import bcrypt from "bcrypt";
import express, { Application, Request, Response } from "express";
import { connectDB } from "./config/db";
import User from "./models/user.model";
import { validateSignupData } from "./utils/validate";
import { IUser } from "./types/authentication";
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to DevTinder project!");
});

app.post("/user", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    const hash = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
    });

    await user.save();

    res.send("user saved!");
  } catch (err: any) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const validPassword = await user.isValidPassword(password);

    if (!validPassword) {
      throw new Error("Invalid credentials!");
    }

    const token = await user.generateAuthToken();

    if (!token) throw new Error("Invalid Token!");

    res.cookie("token", token);
    res.send("Login successful!");
  } catch (err: any) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.body.user;
    res.send(user);
  } catch (err: any) {
    res.status(400).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("App is running on the port: ", PORT);
    });
  })
  .catch((err) => console.log(err));
