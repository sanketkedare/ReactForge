import nodemailer from "nodemailer";
import path from "node:path";
import fs from "node:fs";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || `ReactForge <${EMAIL_USER}>`;
const APP_URL = "https://reactforge.sanketkedare.com";

/**
 * Creates reusable Nodemailer transporter using Gmail SMTP
 */
function createTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS.replace(/\s+/g, ""), // Strip spaces if any
    },
  });
}

export interface WelcomeEmailData {
  toEmail: string;
  displayName: string;
  username?: string;
  targetRole?: string;
  experienceLevel?: string;
  primaryFocus?: string;
}

/**
 * Send ultra-premium, enterprise-grade Dark Theme Welcome Email
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const { toEmail, displayName, username, targetRole, experienceLevel, primaryFocus } = data;

  if (!toEmail) {
    console.warn("⚠️ [Email Service] No recipient email provided.");
    return false;
  }

  const transporter = createTransporter();

  if (!transporter) {
    console.warn("⚠️ [Email Service] EMAIL_USER or EMAIL_PASS not configured. Skipping email send.");
    return false;
  }

  const userHandle = username ? `@${username}` : `@${displayName.toLowerCase().replace(/\s+/g, "_")}`;
  const roleDisplay = targetRole || "Frontend Engineer";
  const expDisplay = experienceLevel ? experienceLevel.toUpperCase() : "JUNIOR / SDE-1";
  const focusDisplay = primaryFocus || "Machine Coding Interviews";

  // Check if official ReactForge icon exists in public directory
  const iconPath = path.join(process.cwd(), "public", "ReactForge_Icon.png");
  const hasIconAttachment = fs.existsSync(iconPath);

  const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Welcome to ReactForge</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0d1117; }
    @media screen and (max-width: 620px) {
      .container-table { width: 100% !important; border-radius: 0 !important; border: none !important; }
      .content-padding { padding: 24px 18px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .cta-button { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body bgcolor="#0d1117" style="margin: 0; padding: 0; background-color: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e6edf3;">
  
  <!-- Hidden Preheader Preview Text -->
  <div style="display: none; font-size: 1px; color: #0d1117; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Welcome to ReactForge, ${displayName}! Your 100-task machine coding practice lab is ready. Claim your +50 Starter XP.
  </div>

  <!-- Outer Full Width Background Wrapper -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d1117" style="background-color: #0d1117; width: 100%;">
    <tr>
      <td align="center" style="padding: 32px 12px;">

        <!-- Main Card (600px Max Width) -->
        <table role="presentation" class="container-table" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#161b22" style="max-width: 600px; width: 100%; background-color: #161b22; border: 1px solid #30363d; border-radius: 16px; overflow: hidden;">
          
          <!-- Top Accent Gold Stripe -->
          <tr>
            <td height="4" bgcolor="#f59e0b" style="background-color: #f59e0b; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Header / Brand Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 36px 20px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          ${
                            hasIconAttachment
                              ? `<img src="cid:reactforge-logo" alt="ReactForge" width="48" height="48" style="display: block; width: 48px; height: 48px; border-radius: 10px;" />`
                              : `<span style="font-size: 32px;">⚡</span>`
                          }
                        </td>
                        <td style="vertical-align: middle;">
                          <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                            React<span style="color: #f59e0b;">Forge</span>
                          </div>
                          <div style="font-size: 11px; font-weight: 600; color: #8b949e; letter-spacing: 0.5px; text-transform: uppercase;">
                            Machine Coding Hub
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: #21262d; border: 1px solid #30363d; color: #58a6ff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; font-family: monospace;">
                      100 TASKS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thin Divider -->
          <tr>
            <td style="padding: 0 36px;"><hr style="border: 0; border-top: 1px solid #21262d; margin: 0;" /></td>
          </tr>

          <!-- Hero Headline -->
          <tr>
            <td class="content-padding" style="padding: 28px 36px 12px 36px;">
              <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.4px; line-height: 1.3;">
                Welcome to the Forge, ${displayName}! 🚀
              </h1>
              <p style="margin: 0; font-size: 14px; color: #8b949e; line-height: 1.6;">
                Your developer account has been registered. You now have full access to our curated curriculum of <strong>100 hands-on React machine coding challenges</strong> with live preview environments, code inspection, and AI coaching.
              </p>
            </td>
          </tr>

          <!-- Starter Bonus Banner -->
          <tr>
            <td class="content-padding" style="padding: 12px 36px 20px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#1c2d24" style="background-color: #1c2d24; border: 1px solid #238636; border-radius: 12px; padding: 14px 16px;">
                <tr>
                  <td width="36" style="vertical-align: middle; font-size: 22px;">
                    ⭐
                  </td>
                  <td style="vertical-align: middle; padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #3fb950;">
                      +50 Starter XP Granted!
                    </div>
                    <div style="font-size: 12px; color: #8b949e; margin-top: 2px;">
                      Your profile is ready. Start your first challenge to build your streak.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Developer Profile Matrix -->
          <tr>
            <td class="content-padding" style="padding: 0 36px 24px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d1117" style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 16px 20px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #21262d;">
                    <span style="font-size: 11px; font-weight: 700; color: #8b949e; text-transform: uppercase; letter-spacing: 0.8px;">
                      Developer Profile Overview
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 6px 0; font-size: 13px; color: #8b949e;">Handle:</td>
                  <td align="right" style="padding: 10px 0 6px 0; font-size: 13px; font-weight: 700; color: #f59e0b; font-family: monospace;">${userHandle}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8b949e;">Target Role:</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #58a6ff;">${roleDisplay}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8b949e;">Experience Tier:</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #bc8cff;">${expDisplay}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8b949e;">Primary Focus:</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; color: #e6edf3;">${focusDisplay}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0 0 0; font-size: 13px; color: #8b949e;">Streak:</td>
                  <td align="right" style="padding: 6px 0 0 0; font-size: 13px; font-weight: 700; color: #f97316;">🔥 Day 1 Active</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3 Interview Round Tracks -->
          <tr>
            <td class="content-padding" style="padding: 0 36px 28px 36px;">
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">
                Curriculum Structure (100 Challenges):
              </div>

              <!-- Track 1 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d1117" style="background-color: #0d1117; border: 1px solid #238636; border-left: 4px solid #238636; border-radius: 8px; margin-bottom: 10px; padding: 12px 14px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #3fb950;">🟢 Round 1: SDE-1 / Junior (40 Tasks • 15–30m)</div>
                    <div style="font-size: 12px; color: #8b949e; margin-top: 3px; line-height: 1.4;">
                      Password Generator, Todo List, Tic-Tac-Toe, Stopwatch, OTP Box, Modals, Cart Counter.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Track 2 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d1117" style="background-color: #0d1117; border: 1px solid #9e6a03; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 10px; padding: 12px 14px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #d29922;">🟡 Round 2: SDE-2 / Mid-Level (35 Tasks • 30–45m)</div>
                    <div style="font-size: 12px; color: #8b949e; margin-top: 3px; line-height: 1.4;">
                      useDebounce / useThrottle, Infinite Scroll, Tree Explorer, Typeahead Autocomplete, Kanban DnD.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Track 3 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d1117" style="background-color: #0d1117; border: 1px solid #8957e5; border-left: 4px solid #a371f7; border-radius: 8px; padding: 12px 14px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #bc8cff;">🟣 Round 3: Senior / System Design (25 Tasks • 50–60m)</div>
                    <div style="font-size: 12px; color: #8b949e; margin-top: 3px; line-height: 1.4;">
                      100k Virtual Kanban, Profiler Lab, State Battleground, Code AST Editor, Web Worker Compute.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Call to Action Button -->
          <tr>
            <td class="content-padding" style="padding: 0 36px 36px 36px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" bgcolor="#f59e0b" style="background-color: #f59e0b; border-radius: 8px;">
                          <a href="${APP_URL}/projects" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 14px; font-weight: 700; color: #07090e; text-decoration: none; border-radius: 8px; letter-spacing: 0.2px;">
                            Launch 100-Task Studio &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <a href="${APP_URL}/profile" target="_blank" style="font-size: 12px; color: #58a6ff; text-decoration: none;">
                      View your profile dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#0d1117" style="background-color: #0d1117; border-top: 1px solid #21262d; padding: 24px 36px; text-align: center; font-size: 12px; color: #6e7681; line-height: 1.6;">
              <div style="color: #8b949e; font-weight: 600; margin-bottom: 4px;">
                ReactForge &bull; Frontend Developer Practice Lab
              </div>
              <div>
                You received this email because you registered an account at <a href="${APP_URL}" style="color: #58a6ff; text-decoration: none;">${APP_URL}</a>.
              </div>
              <div style="margin-top: 8px; color: #484f58; font-size: 11px;">
                &copy; 2026 ReactForge. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
        <!-- /Main Card -->

      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    console.log(`📧 [Email Service] Dispatching professional welcome email to ${toEmail}...`);

    const mailOptions: nodemailer.SendMailOptions = {
      from: EMAIL_FROM,
      to: toEmail,
      subject: `⚡ Welcome to ReactForge, ${displayName}! (+50 Starter XP Granted ⭐)`,
      html: htmlContent,
      attachments: hasIconAttachment
        ? [
            {
              filename: "ReactForge_Icon.png",
              path: iconPath,
              cid: "reactforge-logo",
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Welcome email sent successfully! Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(`🔴 [Email Service] Failed to send welcome email:`, error.message || error);
    return false;
  }
}
