const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "A first name is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
      validate: {
        validator: () => !this.name,
        message: "A first name is required",
      },
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (email) {
          return isEmail(email);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("email")) {
    const existingUser = await mongoose
      .model("User")
      .findOne({ email: this.email });
    if (existingUser) {
      return next(new Error(`Email is already in use`));
    }
    next();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
