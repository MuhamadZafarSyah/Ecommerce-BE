import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "KOcak"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
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

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("email must be unique"));
  } else {
    next();
  }
});
userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
