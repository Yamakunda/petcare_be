const express = require("express");
const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");


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
  const cookie = req.cookies;
  const { email, password } = req.body;
  const account = await Account.login(email, password);
  try {
    const access_token = jwt.sign({ id: account._id, role: account.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m"
    })
    const refresh_token = jwt.sign({ id: account._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d"
    })
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      maxage: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'None'
    });
    res.status(200).send({ jwt: access_token, role: account.role });
  } catch (error) {
    res.status(400).send(error);
  }
}
module.exports.handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401);
  const refresh_token = cookie.jwt;
  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (error, decodedToken) => {
    if (error) { res.sendStatus(403); }
    const account = await Account.findOne({ _id: decodedToken.id });
    const access_token = jwt.sign({ id: account._id, role: account.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m"
    })
    res.status(200).send({ jwt: access_token });
  });
}
module.exports.logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: "Logged out" });
}
module.exports.post = async (req, res) => {
  const account = await Account.findOne({ _id: req.id });
  console.log(account);
  res.json(account);
}
