// @TEMP
import { getEnv } from 'common/utils';
import nodemailer from 'nodemailer';

export const sendmail = async (email: string, attachment: string, subject: string) => {
  // const transporter = nodemailer.createTransport({
  //   host: "poczta1.mat.umk.pl",
  //   port: 587,
  //   auth: {
  //     user: "lasek",
  //     pass: process.env.SMTP_PASS,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port: parseInt(getEnv("SMTP_PORT")),
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASS"),
    },
  });

  const mailOptions = {
    from: 'lasek.accounts@icloud.com',
    to: email,
    subject: subject,
    text: subject,
    attachments: [
      { filename: 'attachment.pdf', path: attachment },
    ],
  };

  console.log("Sending DELIVERED", mailOptions)

  try {
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error(e);
  }


  console.log("Done")
}

interface Mail {
  subject: string;
  to: string;
  text: string;
  texattachments: string[];
}
