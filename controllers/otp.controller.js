const nodemailer = require('nodemailer');
const Otp = require("../models/otp.model");

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'candikool0@gmail.com', 
    pass: 'son150603'   
  }
});

module.exports.createOTP = async (req, res) => {
  const { email, job } = req.body;
  try {
    if(!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const lastotp = await Otp.findOne({ email: email, job: job }).sort({ createDate: -1 });

    if (lastotp) {
      const now = new Date();
      if (now < lastotp.expireDate) {
        return res.status(400).json({ error: "Please wait for 3 minutes before requesting another OTP" });
      }
      await Otp.findByIdAndDelete(lastotp._id);
    }
    const otp = await Otp.create({ email, job });
    
    const mailOptions = {
      from: 'candikool0@gmail.com', // Your email address
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