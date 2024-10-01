import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Username is already taken"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already taken"],
    validate: [validator.isEmail, "This type must be valid email"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "password must at least 6 length"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a given password with the user's hashed password.
 *
 * @param {string} reqBody - The password to compare with the user's password.
 * @return {Promise<boolean>} True if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
