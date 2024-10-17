import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "esmeralda.mohr30@ethereal.email",
    pass: "JdtVMJrBy8QNcFu5KH",
  },
});
export default transporter