const Account = require("../models/account.model");

module.exports.updateAccount = async (req, res) => {
  const { id } = req.params;
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