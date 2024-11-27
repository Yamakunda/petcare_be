const nodemailer = require('nodemailer');
const Otp = require("../models/otp.model");
const Account = require("../models/account.model");

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD 
  }
});

module.exports.createOTP = async (req, res) => {
  const { email, job } = req.body;
  try {
    if(!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const account = await Account.findOne({ email: email });
    if (account) {
      return res.status(404).json({ error: "Email existed" });
    }
    const lastotp = await Otp.findOne({ email: email, job: job }).sort({ createDate: -1 });
    if (lastotp) {
      const now = new Date();
      if (now < lastotp.expireDate) {
        return res.status(400).json({ error: "Please wait for 3 minutes before requesting another OTP" });
      } else {}
      await Otp.findByIdAndDelete(lastotp._id);
    }
    const otp = await Otp.create({ email, job });
    // const mailOptions = {
    //   from: process.env.GMAIL, // Your email address
    //   to: email,
    //   subject: 'Mã OTP của BKPetCare',
    //   text: `Mã OTP của bạn là ${otp.otp}. Đừng chia sẻ mã này với bất kỳ ai khác. Mã này sẽ hết hạn sau 3 phút.`
    // };
    const mailOptions = {
      from: {
        name: 'BKPetCare',
        address: process.env.GMAIL
      },
      to: email,
      subject: 'Mã OTP của BKPetCare',
      text: `Mã OTP của bạn là ${otp.otp}. Đừng chia sẻ mã này với bất kỳ ai khác. Mã này sẽ hết hạn sau 3 phút.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending OTP email', error });
      }
      res.status(201).json({ message: 'OTP sent successfully', otp });
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.verifyOTP = async (req, res) => {
  const { email, otp, job } = req.body;
  try {
    const otpData = await Otp.findOne({ email, job }).sort({ createDate: -1 });
    if (!otpData) {
      console.log("OTP not found");
      return res.status(404).json({ error: "OTP not found" });
    }
    const now = new Date();
    if (now > otpData.expireDate) {
      console.log("OTP has expired");
      return res.status(400).json({ error: "OTP has expired" });
    }
    if (otpData.otp === otp) {
      console.log("OTP verified successfully");
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      console.log("OTP is incorrect");
      return res.status(400).json({ error: "OTP is incorrect" });
    }
  } catch (error) {
    res.status(400).send(error);
  };
}