import nodemailer from "nodemailer";
import dbConnect from "@/config/connectDB";
import ContactInfo from "@/models/ContactInfo";

interface QuoteEmailPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  exhibitionName: string;
  stallNumber?: string;
  boothSize: string;
  boothType?: string;
  budget?: string;
  services?: string[];
  eventDate?: string;
  message?: string;
  attachment?: {
    url?: string;
    publicId?: string;
  };
}

/**
 * Build a nodemailer transporter based on environment variables
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const rawUser = process.env.SMTP_USER
  const rawPass = process.env.SMTP_PASS

  if (!rawUser || !rawPass) {
    return null;
  }

  const user = rawUser.trim().replace(/^["']|["']$/g, "");
  // Google App passwords come in 4-character chunks with spaces; strip whitespace for 100% reliable auth
  const pass = rawPass.replace(/\s+/g, "").replace(/^["']|["']$/g, "");

  // If host is explicitly set (e.g. smtp.gmail.com, mail.domain.com)
  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Default to Gmail service if user is a Gmail address
  if (user.includes("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Send dual notification emails for a newly submitted quote request:
 * 1. Admin Email (with full client & booth project specs)
 * 2. Client Email (warm greetings, quick contact assurance, WhatsApp & WeChat QR codes)
 */
export async function sendQuoteEmails(data: QuoteEmailPayload) {
  const transporter = getTransporter();
  const rawSmtpUser = process.env.SMTP_USER;
  const rawSmtpPass = process.env.SMTP_PASS;

  if (!rawSmtpUser || !rawSmtpPass || !transporter) {
    console.warn(
      "⚠️ [Mailer] SMTP_USER or SMTP_PASS is not configured in .env. Skipping email dispatch."
    );
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  // Strictly use SMTP_USER and SMTP_PASS from .env
  const smtpUser = rawSmtpUser.trim().replace(/^["']|["']$/g, "");
  const fromEmail = smtpUser;
  // Admin notification email goes directly to the SMTP_USER inbox
  const adminEmail = smtpUser;

  // Fetch dynamic WhatsApp, WeChat, and QR codes from ContactInfo in DB
  let contact = {
    whatsapp: "+8801816756997",
    whatsappQrCode:
      "https://res.cloudinary.com/dde4nz1a0/image/upload/v1789736317/exhibition/file_1789736315992.png",
    wechat: "country_communication",
    wechatQrCode:
      "https://res.cloudinary.com/dde4nz1a0/image/upload/v1789736322/exhibition/file_1789736322160.png",
    primaryPhone: "+8801816756997",
    primaryEmail: "countrycommu@gmail.com",
  };

  try {
    await dbConnect();
    const dbContact: any = await ContactInfo.findOne().lean();
    if (dbContact) {
      if (dbContact.whatsapp) contact.whatsapp = dbContact.whatsapp;
      if (dbContact.whatsappQrCode?.url) contact.whatsappQrCode = dbContact.whatsappQrCode.url;
      if (dbContact.wechat) contact.wechat = dbContact.wechat;
      if (dbContact.wechatQrCode?.url) contact.wechatQrCode = dbContact.wechatQrCode.url;
      if (dbContact.primaryPhone) contact.primaryPhone = dbContact.primaryPhone;
      if (dbContact.primaryEmail) contact.primaryEmail = dbContact.primaryEmail;
    }
  } catch (err) {
    console.warn("[Mailer] Using fallback contact info:", err);
  }

  const cleanWhatsApp = contact.whatsapp.replace(/[^0-9]/g, "");
  const clientCleanPhone = data.phone.replace(/[^0-9]/g, "");

  const servicesListHtml =
    data.services && data.services.length > 0
      ? data.services
          .map(
            (s) =>
              `<span style="display:inline-block;background:#fee2e2;color:#b91c1c;padding:5px 12px;border-radius:12px;font-size:12px;margin:3px 4px 3px 0;font-weight:600;border:1px solid #fecaca;">✓ ${s}</span>`
          )
          .join("")
      : '<span style="color:#6b7280;font-style:italic;">None selected</span>';

  // =========================================================================
  // 1. ADMIN EMAIL HTML TEMPLATE (All Client & Project Information)
  // =========================================================================
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Exhibition Quote Inquiry</title>
      </head>
      <body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1f2937;background-color:#f3f4f6;margin:0;padding:24px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#991b1b 0%,#b91c1c 50%,#7f1d1d 100%);padding:28px 30px;color:#ffffff;">
              <span style="display:inline-block;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">
                🔔 NEW CLIENT INQUIRY
              </span>
              <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:0.5px;">
                ${data.companyName}
              </h1>
              <p style="margin:6px 0 0 0;font-size:14px;color:#fecaca;">
                Exhibition: <strong>${data.exhibitionName}</strong> • Booth Size: <strong>${data.boothSize}</strong>
              </p>
            </td>
          </tr>

          <!-- Quick Action Bar -->
          <tr>
            <td style="background:#fef2f2;padding:14px 30px;border-bottom:1px solid #fee2e2;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#991b1b;font-weight:600;">
                    Quick Actions:
                  </td>
                  <td align="right">
                    <a href="mailto:${data.email}?subject=Re:%20Exhibition%20Booth%20Quote%20-%20${encodeURIComponent(data.exhibitionName)}" style="display:inline-block;background:#b91c1c;color:#ffffff;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;margin-right:6px;">
                      ✉️ Reply Email
                    </a>
                    <a href="https://wa.me/${clientCleanPhone}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;margin-right:6px;">
                      💬 WhatsApp
                    </a>
                    <a href="tel:${data.phone.replace(/\s/g, "")}" style="display:inline-block;background:#111827;color:#ffffff;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">
                      📞 Call
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:28px 30px;">
              <!-- Section 1: Client Info -->
              <h3 style="color:#111827;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;margin:0 0 12px 0;padding-bottom:6px;border-bottom:2px solid #fee2e2;">
                👤 Client & Contact Information
              </h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:24px;">
                <tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                  <td width="36%" style="font-weight:600;color:#4b5563;">Contact Person:</td>
                  <td style="color:#111827;font-weight:700;">${data.name}</td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="font-weight:600;color:#4b5563;">Company Name:</td>
                  <td style="color:#111827;font-weight:700;">${data.companyName}</td>
                </tr>
                <tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                  <td style="font-weight:600;color:#4b5563;">Email Address:</td>
                  <td>
                    <a href="mailto:${data.email}" style="color:#b91c1c;font-weight:600;text-decoration:none;">
                      ${data.email}
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="font-weight:600;color:#4b5563;">Phone / WhatsApp:</td>
                  <td>
                    <a href="tel:${data.phone.replace(/\s/g, "")}" style="color:#111827;font-weight:600;text-decoration:none;">
                      ${data.phone}
                    </a>
                  </td>
                </tr>
                ${
                  data.city || data.country
                    ? `<tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                        <td style="font-weight:600;color:#4b5563;">Location:</td>
                        <td style="color:#111827;">${[data.city, data.country].filter(Boolean).join(", ")}</td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Section 2: Booth Specifications -->
              <h3 style="color:#111827;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;margin:24px 0 12px 0;padding-bottom:6px;border-bottom:2px solid #fee2e2;">
                📐 Exhibition & Booth Specifications
              </h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:24px;">
                <tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                  <td width="36%" style="font-weight:600;color:#4b5563;">Exhibition Name:</td>
                  <td style="color:#111827;font-weight:700;">${data.exhibitionName}</td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="font-weight:600;color:#4b5563;">Booth Size:</td>
                  <td style="color:#b91c1c;font-weight:800;font-size:15px;">${data.boothSize}</td>
                </tr>
                <tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                  <td style="font-weight:600;color:#4b5563;">Booth Type / Sides:</td>
                  <td style="color:#111827;font-weight:600;">${data.boothType || "Standard"}</td>
                </tr>
                ${
                  data.stallNumber
                    ? `<tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="font-weight:600;color:#4b5563;">Stall / Booth #:</td>
                        <td style="color:#111827;">${data.stallNumber}</td>
                      </tr>`
                    : ""
                }
                ${
                  data.budget
                    ? `<tr style="background:#f9fafb;border-bottom:1px solid #f3f4f6;">
                        <td style="font-weight:600;color:#4b5563;">Estimated Budget:</td>
                        <td style="color:#047857;font-weight:700;">${data.budget}</td>
                      </tr>`
                    : ""
                }
                ${
                  data.eventDate
                    ? `<tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="font-weight:600;color:#4b5563;">Setup / Event Date:</td>
                        <td style="color:#111827;">${data.eventDate}</td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Section 3: Services -->
              <h3 style="color:#111827;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;margin:24px 0 12px 0;padding-bottom:6px;border-bottom:2px solid #fee2e2;">
                🛠️ Requested Services
              </h3>
              <div style="margin-bottom:24px;">
                ${servicesListHtml}
              </div>

              <!-- Section 4: Client Message -->
              ${
                data.message
                  ? `<h3 style="color:#111827;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;margin:24px 0 10px 0;padding-bottom:6px;border-bottom:2px solid #fee2e2;">
                      💬 Client Message / Project Brief
                    </h3>
                    <div style="background:#fef2f2;border-left:4px solid #b91c1c;padding:14px 18px;border-radius:8px;font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.6;margin-bottom:24px;">
                      ${data.message}
                    </div>`
                  : ""
              }

              <!-- Section 5: Attachment -->
              ${
                data.attachment?.url
                  ? `<div style="padding:14px 18px;background:#f3f4f6;border-radius:10px;border:1px solid #e5e7eb;margin-bottom:24px;">
                      <strong style="color:#111827;">📎 Attached Reference / Layout:</strong>
                      <a href="${data.attachment.url}" target="_blank" style="color:#b91c1c;font-weight:700;margin-left:8px;text-decoration:none;">
                        Open / Download Attachment File →
                      </a>
                    </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:18px 30px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
              Submitted from Country Communication Web Portal on ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })} (BST).
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // =========================================================================
  // 2. CLIENT CONFIRMATION EMAIL (Warm Greetings + Quick Contact + QR Codes)
  // =========================================================================
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Greetings from Country Communication</title>
      </head>
      <body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1f2937;background-color:#f3f4f6;margin:0;padding:24px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">
          <!-- Brand Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#991b1b 0%,#b91c1c 50%,#7f1d1d 100%);padding:36px 30px;text-align:center;color:#ffffff;">
              <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:1px;">
                COUNTRY COMMUNICATION
              </h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:#fecaca;letter-spacing:0.5px;">
                Premier Exhibition Stand Design & Fabrication Specialist
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 30px;">
              <!-- Warm Greetings (শুভেচ্ছা বার্তা) -->
              <p style="font-size:17px;color:#111827;font-weight:700;margin:0 0 12px 0;">
                Dear ${data.name} (${data.companyName}),
              </p>
              <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px 0;">
                Warm greetings from <strong>Country Communication</strong>! We sincerely appreciate you reaching out to us regarding your upcoming exhibition booth design and fabrication for <strong>${data.exhibitionName}</strong>.
              </p>

              <!-- Quick Contact Assurance (খুব দ্রুত যোগাযোগ করা হবে) -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:5px solid #16a34a;border-radius:12px;padding:18px 20px;margin:24px 0;">
                <p style="margin:0;font-size:15px;color:#166534;font-weight:700;">
                  ✓ Your Quote Request has been received!
                </p>
                <p style="margin:8px 0 0 0;font-size:14px;color:#15803d;line-height:1.6;">
                  Our structural architects and 3D design team are already analyzing your booth specifications. <strong>Our dedicated project specialist will contact you very soon</strong> with a customized 3D design concept and formal budget proposal.
                </p>
              </div>

              <!-- Brief Specs Summary -->
              <div style="background:#f9fafb;border-radius:12px;padding:18px 20px;margin:24px 0;border:1px solid #e5e7eb;">
                <h4 style="margin:0 0 10px 0;color:#991b1b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">
                  📋 Summary of Your Request:
                </h4>
                <ul style="margin:0;padding-left:20px;font-size:14px;color:#4b5563;line-height:1.7;">
                  <li><strong>Exhibition / Expo:</strong> ${data.exhibitionName}</li>
                  <li><strong>Booth Dimensions:</strong> ${data.boothSize}</li>
                  <li><strong>Booth Style / Sides:</strong> ${data.boothType || "Custom"}</li>
                  ${data.budget ? `<li><strong>Estimated Budget:</strong> ${data.budget}</li>` : ""}
                </ul>
              </div>

              <!-- Direct Contact & QR Codes Section (WhatsApp & WeChat) -->
              <div style="margin:32px 0 16px 0;text-align:center;">
                <h3 style="margin:0 0 6px 0;font-size:17px;color:#111827;font-weight:800;">
                  Connect With Us Instantly
                </h3>
                <p style="margin:0 0 20px 0;font-size:13px;color:#6b7280;line-height:1.5;">
                  Need urgent discussion or want to send 3D layout references directly? Scan our QR codes or click below to chat with our team right away:
                </p>

                <!-- 2 Column Responsive Table for WhatsApp & WeChat -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:12px 0;">
                  <tr>
                    <!-- WhatsApp Column -->
                    <td width="50%" valign="top" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;padding:20px 14px;text-align:center;">
                      <div style="display:inline-block;background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:12px;">
                        🟢 WhatsApp
                      </div>
                      <div style="margin-bottom:12px;">
                        <img
                          src="${contact.whatsappQrCode}"
                          alt="WhatsApp QR Code"
                          width="130"
                          height="130"
                          style="display:block;margin:0 auto;border:1px solid #d1d5db;border-radius:12px;padding:6px;background:#ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.05);"
                        />
                      </div>
                      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1f2937;">
                        ${contact.whatsapp}
                      </p>
                      <p style="margin:0 0 12px 0;font-size:11px;color:#6b7280;">
                        Scan to chat on WhatsApp
                      </p>
                      <a
                        href="https://wa.me/${cleanWhatsApp}"
                        target="_blank"
                        style="display:inline-block;background:#25D366;color:#ffffff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:24px;text-decoration:none;box-shadow:0 3px 8px rgba(37,211,102,0.3);"
                      >
                        Chat on WhatsApp →
                      </a>
                    </td>

                    <!-- WeChat Column -->
                    <td width="50%" valign="top" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;padding:20px 14px;text-align:center;">
                      <div style="display:inline-block;background:#e0f2fe;color:#0369a1;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:12px;">
                        💬 WeChat
                      </div>
                      <div style="margin-bottom:12px;">
                        <img
                          src="${contact.wechatQrCode}"
                          alt="WeChat QR Code"
                          width="130"
                          height="130"
                          style="display:block;margin:0 auto;border:1px solid #d1d5db;border-radius:12px;padding:6px;background:#ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.05);"
                        />
                      </div>
                      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1f2937;">
                        ID: <span style="color:#0369a1;">${contact.wechat}</span>
                      </p>
                      <p style="margin:0;font-size:11px;color:#6b7280;line-height:1.4;">
                        Scan with WeChat camera to add our specialist directly
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Contact Hotline Box -->
              <div style="background:#fef2f2;border:1px dashed #f87171;border-radius:12px;padding:16px 20px;text-align:center;margin-top:28px;">
                <p style="margin:0 0 6px 0;font-weight:700;font-size:13px;color:#991b1b;">
                  Have an urgent question or upcoming exhibition deadline?
                </p>
                <p style="margin:0;font-size:13px;color:#4b5563;">
                  Hotline / Phone: <a href="tel:${contact.primaryPhone.replace(/\s/g, "")}" style="color:#b91c1c;font-weight:700;text-decoration:none;">${contact.primaryPhone}</a>
                  &nbsp;•&nbsp;
                  Email: <a href="mailto:${contact.primaryEmail}" style="color:#b91c1c;font-weight:700;text-decoration:none;">${contact.primaryEmail}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 30px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
              <strong style="color:#111827;">Country Communication</strong><br />
              House-30, (Lift-03), Road-07, Block-C, Niketan, Gulshan-1, Dhaka-1212, Bangladesh<br />
              <a href="https://countrycommu.com" style="color:#b91c1c;text-decoration:none;font-weight:600;">www.countrycommu.com</a>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (!transporter) {
    console.warn(
      "⚠️ [Mailer] SMTP credentials are not configured in .env (SMTP_USER/SMTP_PASS). Skipping email dispatch."
    );
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  try {
    // 1. Dispatch to Admin (contains full client & project specifications)
    const adminPromise = transporter.sendMail({
      from: `"Country Communication Portal" <${fromEmail}>`,
      to: adminEmail,
      replyTo: data.email,
      subject: `🔔 New Free Quote Request: ${data.companyName} - ${data.exhibitionName} (${data.boothSize})`,
      html: adminEmailHtml,
    });

    // 2. Dispatch to Client (contains warm greetings, assurance to contact soon, and WhatsApp & WeChat QR codes)
    const clientPromise = transporter.sendMail({
      from: `"Country Communication" <${fromEmail}>`,
      to: data.email,
      subject: `Greetings from Country Communication - We Received Your Booth Inquiry (${data.exhibitionName})`,
      html: clientEmailHtml,
    });

    const [adminResult, clientResult] = await Promise.allSettled([
      adminPromise,
      clientPromise,
    ]);

    console.log("Admin Email Result:", adminResult.status);
    console.log("Client Email Result:", clientResult.status);

    return {
      success: true,
      adminSent: adminResult.status === "fulfilled",
      clientSent: clientResult.status === "fulfilled",
    };
  } catch (error: any) {
    console.error("❌ [Mailer] Failed to send quote emails:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
