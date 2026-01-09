import nodemailer from "nodemailer";

/**
 * Creates a transporter for sending emails.
 * It will use environment variables for a real SMTP service if provided,
 * otherwise it falls back to a temporary Ethereal test account.
 */
function createTransporter() {
  const user = "thegloriousbrand1@gmail.com";
  const pass = process.env.GOOGLE_APP_PASSWORD;

  if (!pass) {
    console.warn(
      "No email password or app password provided. Email sending may fail."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });
}

export const transporter = createTransporter();
