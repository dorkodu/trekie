import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

function sendTest(from: string, to: string): Promise<boolean> {
  return new Promise(resolve => {
    transporter.sendMail(
      {
        from,
        to,
        subject: "Test",
        text: "This is a test mail.",
        html: "<p>This is a test mail.</p>",
      },
      (err, _info) => {
        const sent = !err;
        resolve(sent);
      }
    );
  });
}

export const mailer = {
  sendTest,
}