import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Schema, Models, Model } from "mongoose";

const userSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  lastName: {
    type: String,
    minLength: 1,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = await jwt.sign({_id: user._id}, "secret", {expiresIn: "7d"});

  return token;
}

userSchema.methods.isValidPassword = async function(password: string){
  const user = this;
  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword;
}

const User = mongoose.model("User", userSchema);
export default User;
