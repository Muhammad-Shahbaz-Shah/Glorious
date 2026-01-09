import { transporter } from "@/lib/emailconfig";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { subject, message, userEmail, userName } = await req.json();

    await transporter.sendMail({
      from: userEmail,
        to: "thegloriousbrand1@gmail.com",
      subject: subject,
      text: message,
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Request</title>
        <style>
            /* Base Reset */
            body {
                margin: 0;
                padding: 0;
                width: 100% !important;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                background-color: #f4f7f9;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
    
            table { border-spacing: 0; border-collapse: collapse; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
    
            /* Layout */
            .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f9; padding-bottom: 40px; }
            .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1f2937; border-radius: 16px; overflow: hidden; margin-top: 40px; border: 1px solid #e5e7eb; }
    
            /* Header */
            .header { background-color: #000000; padding: 30px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    
            /* Content */
            .content { padding: 40px 30px; }
            
            /* Badge */
            .badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                background-color: #eff6ff;
                color: #2563eb;
                margin-bottom: 20px;
            }
    
            /* User Card */
            .user-card {
                background-color: #f8fafc;
                border: 1px solid #f1f5f9;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 30px;
            }
            .user-label { color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
            .user-value { color: #1e293b; font-size: 15px; font-weight: 500; margin-bottom: 12px; }
    
            /* Message Area */
            .message-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
            .message-text { font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    
            /* Footer */
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <center class="wrapper">
            <table class="main" width="100%">
                <tr>
                    <td class="header">
                        <h1>Support Ticket Received</h1>
                    </td>
                </tr>
    
                <tr>
                    <td class="content">
                        <div class="badge">SUBJECT:${subject}</div>
                        
                        <div class="user-card">
                            <div class="user-label">Submitted By</div>
                            <div class="user-value">${userName}</div>
                            
                            <div class="user-label">Email Address</div>
                            <div class="user-value">${userEmail}</div>
                            
                            <div class="user-label">Account Status</div>
                            <div class="user-value" style="color: #059669;">● Verified User</div>
                        </div>
    
                        <div class="message-title">Message Details</div>
                        <div class="message-text">${message}</div>
                    </td>
                </tr>
    
                <tr>
                    <td style="padding: 0 30px;"><hr style="border: none; border-top: 1px solid #f1f5f9;"></td>
                </tr>
    
                <tr>
                    <td class="footer">
                        Sent from <strong>Glorious</strong><br>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>`,
    });

    return NextResponse.json({
      message: "Message sent successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
