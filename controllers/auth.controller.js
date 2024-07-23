const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
const maxage = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxage
  })
}

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.create({ email, password });
    res.status(201).send(account);
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = createToken(account._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxage });
    console.log(token);
    res.status(200).send({jwt: token});
  } catch (error) {
    res.status(400).send(error);
  }
}
module.exports.post = async (req, res) => {
  const account = await Account.findOne({ _id: req.id });
  console.log(account);
  res.json(account);
}