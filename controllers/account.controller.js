const Account = require("../models/account.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const generate = require("../helpers/generate");
const imagekit = require("../config/imagekit");
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD 
  }
});
module.exports.createAccount = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role == "user") {
      const account = await Account.create({ email, password, role });
      const cart = await Cart.create({ user_id: account._id });
      res.status(200).send(account);
    }
    else {
      const account = await Account.create({ email, password });
      res.status(200).send(account);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.getAccountInfo = async (req, res) => {
  const { id } = req;
  try {
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateAccount = async (req, res) => {
  const { id } = req;
  const currentAccount = await Account.findById(id);
  const ImgId = currentAccount.avatar.public_id;
  try {
    // if (ImgId != "null") {
    //   await imagekit.deleteFile(ImgId);
    // }
    if (req.body.avatar.public_id == "null") {
      const result = await imagekit.upload({
        file: req.body.avatar.url,
        fileName: "account_image",
        folder: "accounts"
      });
      req.body.avatar = { public_id: result.fileId, url: result.url };
    }
    const account = await Account.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  const currentAccount = await Account.findById(id);
  const ImgId = currentAccount.avatar.public_id;
  // if (ImgId != "null") {
  //   await imagekit.deleteFile(ImgId);
  // }
  try {
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const cart = await Cart.findOneAndDelete({ user_id: id });
    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.changePassword = async (req, res) => {
  const { id } = req;
  const { oldpassword, newpassword } = req.body;
  try {
    console.log("Change password");
    var account = await Account.findById(id);
    const check = await bcrypt.compare(oldpassword, account.password);
    if (!check) {
      console.log("Old password is incorrect");
      return res.status(400).json({ message: "WRONG_PASSWORD" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      account = await Account.findByIdAndUpdate(id, {
        password: hashedPassword
      });
      console.log("Change password successfully");
      res.status(200).json({ account });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    console.log(1);
    var account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    console.log(2);
    const newpassword = generate.generateRandomNumber(8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    console.log(3);
    account = await Account.findByIdAndUpdate(account._id, {
      password: hashedPassword
    });
    console.log("New password: " + newpassword);
    const mailOptions = {
      from: {
        name: 'BKPetCare',
        address: process.env.GMAIL
      },
      to: email,
      subject: 'Mật khẩu mới cho BKPetCare',
      text: `Mật khẩu mới của bạn là ${newpassword}. Đừng chia sẻ mật khẩu này với bất kỳ ai khác.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending password', error });
      }
    });
    console.log("Sent new password to your email");
    res.status(200).json({message:"Sent new password to your email"});
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListUsers = async (req, res) => {
  try {
    const users = await Account.find({ role: "user" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports.getListAdmins = async (req, res) => {
  try {
    const admins = await Account.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports.getListDoctors = async (req, res) => {
  try {
    const doctors = await Account.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}