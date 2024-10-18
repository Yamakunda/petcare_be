const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

module.exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role) {
      const account = await Account.create({ email, password, role });
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
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const access_token = jwt.sign(
      { id: account._id, role: account.role},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    const refresh_token = jwt.sign(
      { id: account._id, role: account.role},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: true, // Set to true in production
      sameSite: 'None', // Adjust based on environment
      path: '/' // Ensure the path is correct
    });
    res.status(200).send({ jwt: access_token, role: account.role, id: account._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.handleRefreshToken = async (req, res) => {
  // const cookies = req.cookies;
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(403); // Forbidden
  const refresh_token = cookies.refreshToken;
  try {
    const decodedToken = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const account = await Account.findOne({ _id: decodedToken.id });

    if (!account) return res.sendStatus(403); // Forbidden

    const access_token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).send({ jwt: access_token, role: account.role, id: account._id });
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return res.sendStatus(403); // Forbidden
  }
};
module.exports.logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt");
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: "Logged out" });
}
module.exports.post = async (req, res) => {
  const account = await Account.findOne({ _id: req.id });
  res.status(200).json(account);
}
