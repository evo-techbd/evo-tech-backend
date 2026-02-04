import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
import config from "../../config";
import { TUser, UserModel } from "./user.interface";
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema<TUser, UserModel>(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "user", "employee"],
      default: "user",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    defaultShippingAddressId: {
      type: String,
    },
    defaultBillingAddressId: {
      type: String,
    },
    emailVerifiedAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    newsletterOptIn: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // Only hash password if it exists and has been modified
  if (user.password && user.isModified("password")) {
    user.password = await bcryptjs.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

// Post-save middleware to clear password
userSchema.post("save", function (doc, next) {
  if (doc.password) {
    doc.password = "";
  }
  next();
});

// Static method to check if user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

// Static method to check if password matches
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
