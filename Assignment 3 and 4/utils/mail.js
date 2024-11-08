import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPW,
  },
});
export default transporter;
