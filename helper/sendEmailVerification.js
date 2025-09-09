import nodemailer from "nodemailer";

import hrActivationTemplate from "./templates/hrActivation";
import employeeActivationTemplate from "./templates/employeeActivation";
import { passwordResetTemplate } from "./templates/passwordReset";
import adminApprovalTemplate from "./templates/notifyAdmin";
import employeeStatusActiveTemplate from "./templates/employeeStatusActive"
import employeeStatusRejectTemplate from './templates/employeeStatusReject'

const templates = {
  hrActivation: hrActivationTemplate,
  employeeActivation:employeeActivationTemplate,
  passwordReset : passwordResetTemplate,
  adminApprovalTemplate:adminApprovalTemplate,
  employeeStatusActiveTemplate:employeeStatusActiveTemplate,
  employeeStatusRejectTemplate:employeeStatusRejectTemplate

}



export async function sendVerificationEmail(to , subject, templateName, variables) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
  user: process.env.SMTP_EMAIL,
  pass: process.env.SMTP_PASSWORD,
},

    });

    const htmlTemplate = templates[templateName] 
    ? await templates[templateName](...variables)
    : `<p>No Template Found</p>`


    const mailOptions = {
      from: `"HR Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html:htmlTemplate
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent ");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email sending failed.");
  }
}

