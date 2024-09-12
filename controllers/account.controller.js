const Account = require("../models/account.model");
const cloudinary = require("../config/cloudinary");

module.exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "accounts",
      // width: 300,
      // crop: "scale"
  })
    console.log(result);
    req.body.avatar = result.secure_url;
  } catch (error) {
    res.status(400).json( { error:"Upload Fail"});
  }

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    res.status(400).json({ error });
  }
}