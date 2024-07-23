const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const bcrypt = require("bcrypt");
const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    userName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    avatar: {
      type: String,
      default: null,
    },

    role_id: {
      type: String,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: String,
      default: null,
    },
  }
);

accountSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

accountSchema.statics.login = async function (email, password) {
  const account = await this.findOne({ email });
  if (account) {
    const auth = await bcrypt.compare(password, account.password);
    if (auth) {
      return account;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
}
const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;