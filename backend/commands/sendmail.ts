// @TEMP
import nodemailer from 'nodemailer';

export const sendmail = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.fbi.com",
    port: 1025,
    tls: {
      rejectUnauthorized: false,
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com',
    subject: 'Subject of the email',
    text: 'Body of the email',
    attachments: [
      {
        filename: 'attachment.txt',
        path: './path/to/attachment.txt',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
