import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { transporter } from "./emailconfig";
import { emailOTP } from "better-auth/plugins";

import mongoose from "mongoose";
import { connectDB } from "./db";

// Ensure DB is connected
await connectDB();
const client = mongoose.connection.getClient();
const db = client.db();

/**
 * Helper function to generate HTML for the verification email.
 */
const getVerificationEmailHtml = (url) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h2 style="text-align: center; color: #16a34a;">Glorious</h2>
  <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
  </div>
  <p style="font-size: 14px; color: #64748b;">If you didn't create an account, you can safely ignore this email.</p>
  <p style="font-size: 14px; color: #64748b; margin-top: 20px;">Or copy and paste this link into your browser:</p>
  <p style="font-size: 12px; color: #64748b; word-break: break-all;">${url}</p>
</div>
`;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    forgetPassword: {
      enabled: true,
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(`Sending verification email to ${user.email}...`);
      try {
        const result = await transporter.sendMail({
          from: '"Glorious" <thegloriousbrand1@gmail.com>',
          to: user.email,
          subject: "Verify your email address",
          html: getVerificationEmailHtml(url),
        });
        console.log("Verification email sent:", result.messageId);
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
    sendOnSignUp: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    modelName: "users", // Correctly identifies your collection
  
    // Allows you to pass extra fields like 'image' during email signup
    additionalFields: {
      image: {
        type: "string",
        required: true,
        defaultValue:"/profile.png"
      },
    },
  },
  database: mongodbAdapter(db, {
    transaction: false,
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ user, otp, type, email }) {
        const targetEmail = user?.email || email;
        console.log(`Sending ${type} OTP to ${targetEmail}...`);
        try {
          const info = await transporter.sendMail({
            from: '"Glorious" <thegloriousbrand1@gmail.com>',
            to: targetEmail,
            subject:
              type === "forget-password"
                ? "Reset your password"
                : "Verify your email",
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="text-align: center; color: #16a34a;">Glorious</h2>
                <p>Your OTP for ${
                  type === "forget-password" ? "password reset" : "verification"
                } is:</p>
                <div style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; color: #1e293b;">
                  ${otp}
                </div>
                <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes.</p>
              </div>
            `,
          });
          console.log(`${type} OTP sent to ${targetEmail}: ${info.messageId}`);
        } catch (error) {
          console.error(`Failed to send ${type} OTP to ${targetEmail}:`, error);
        }
      },
    }),
  ],
});
