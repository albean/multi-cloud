// @TEMP
import nodemailer from 'nodemailer';

export const sendmail = async () => {
  console.log(process.env.SMTP_PASS)
  const transporter = nodemailer.createTransport({
    host: "poczta1.mat.umk.pl",
    port: 587,
    auth: {
      user: "lasek",
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: 'lasek@mat.umk.pl',
    to: 'lasek.accounts@icloud.com',
    subject: 'Subject of the email',
    text: 'Body of the email',
    attachments: [
      {
        filename: 'attachment.pdf',
        path: 'public/businesscard.pdf',
      },
    ],
  };

  console.log("Sending")

  await transporter.sendMail(mailOptions);

  console.log("Done")
}
