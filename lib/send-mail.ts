"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  await transporter.verify();

  return transporter.sendMail({
    from: `"${process.env.MAIL_FROM}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.MAIL_TO,
    subject: `Portfolio Contact - ${name}`,
    html: `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>

      <hr />

      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}