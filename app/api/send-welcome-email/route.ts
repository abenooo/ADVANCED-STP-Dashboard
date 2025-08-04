// app/api/send-welcome-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Check authentication
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
    const token = match ? match[2] : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { email, name, password, role } = await request.json();

    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, password, role" },
        { status: 400 }
      );
    }

    // Get role display name
    const getRoleDisplayName = (role: string) => {
      switch (role) {
        case 'super_admin': return 'Super Administrator';
        case 'admin': return 'Administrator';
        case 'marketing': return 'Marketing';
        default: return role;
      }
    };

    const roleDisplay = getRoleDisplayName(role);
    const companyName = process.env.COMPANY_NAME || 'Advanced TSP Services';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL; // Optional admin email for BCC

    // Create the email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${companyName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e1e5e9; }
            .credentials { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6c757d; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${companyName}!</h1>
              <p>Your account has been created successfully</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name},</h2>
              
              <p>Welcome to our team! Your administrator account has been created with <strong>${roleDisplay}</strong> privileges.</p>
              
              <div class="credentials">
                <h3>🔐 Your Login Credentials</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
                <p><strong>Role:</strong> ${roleDisplay}</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important Security Notice:</strong><br>
                Please change your password immediately after your first login for security purposes.
              </div>
              
              <p>You can now access the admin dashboard using these credentials.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
                Login to Dashboard
              </a>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>
              <strong>${process.env.CONTACT_PERSON || 'Support Team'}</strong><br>
              ${companyName}</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const emailText = `
Welcome to ${companyName}!

Hello ${name},

Welcome to our team! Your administrator account has been created with ${roleDisplay} privileges.

Your Login Credentials:
- Email: ${email}
- Temporary Password: ${password}
- Role: ${roleDisplay}

IMPORTANT SECURITY NOTICE:
Please change your password immediately after your first login for security purposes.

You can now access the admin dashboard using these credentials.

Login URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
${process.env.CONTACT_PERSON || 'Support Team'}
${companyName}

---
This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} ${companyName}. All rights reserved.
    `;

    // Send the email using Resend
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: email,  // Send to the new user
      ...(adminEmail && { bcc: adminEmail }),  // Conditionally add BCC if admin email is set
      subject: `Welcome to ${companyName} - Your Login Credentials`,
      html: emailHtml,
      text: emailText,
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send welcome email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
