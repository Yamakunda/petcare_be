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
    passwordChangedAt: {
      type: Date,
      default: Date.now,
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
      type: [String],
      default: [],
    },
    avatar: {
      public_id: {
          type: String,
          required: true,
          default: "null"
      },
      url: {
          type: String,
          required: true,
          default: "https://res.cloudinary.com/dzm879qpm/image/upload/v1724509563/DefautAvatar_iayxio.png"
      }
    },
    role: {
      type: String,
      default: "user",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: String,
      default: null,
    },
  },{
    timestamps: true,
  }
);

accountSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
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
    else{
    console.log("Incorrect password");
    }
  }
  else{
    console.log("Incorrect email");
  }
}
const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
