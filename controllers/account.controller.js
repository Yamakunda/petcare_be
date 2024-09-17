const Account = require("../models/account.model");
const cloudinary = require("../config/cloudinary");
const Cart = require("../models/cart.model");
module.exports.createAccount = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role == "user") {
      const account = await Account.create({ email, password, role });
      const cart = await Cart.create({ user_id: account._id });
      res.status(201).send(account);
    }
    else {
      const account = await Account.create({ email, password });
      res.status(201).send(account);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.updateAccount = async (req, res) => {
  const { id } = req.params;

  const currentAccount = await Account.findById(id);
  const ImgId = currentAccount.avatar.public_id;
  if (ImgId != "null") {
    await cloudinary.uploader.destroy(ImgId);
  }
  try {
    if(req.body.avatar.public_id == ""){
    const result = await cloudinary.uploader.upload(req.body.avatar.url, {
      folder: "accounts",
      // width: 300,
      // crop: "scale"
  })
    console.log(result);
    req.body.avatar = {public_id: result.public_id, url: result.secure_url};
  }
    const account = await Account.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    console.log(account);
    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  const currentAccount = await Account.findById(id);
  const ImgId = currentAccount.avatar.public_id;
  if (ImgId != "null") {
    await cloudinary.uploader.destroy(ImgId);
  }
  try {
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
};