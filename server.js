require('dotenv').config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// The port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://www.crownagrovetltd.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());

app.options("/send-email", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://www.crownagrovetltd.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// The email route
app.post("/send-email", async (req, res) => {
  const { name, email, date, meetingType } = req.body;

  if (!name || !email || !date || !meetingType) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Consultation Request",
    text: `
      Dear Crown Agrovet LTD,

      I hope this message finds you well. I am reaching out to schedule a consultation with your esteemed organization. 
      Below are my details for your reference:

      Name: ${name}
      Email: ${email}
      Preferred Date: ${date}
      Meeting Type: ${meetingType}

      Kindly let me know if the provided date and time work for your schedule, 
      or if there is an alternative that you would recommend. I look forward to your confirmation.

      Thank you for your time and assistance.

      Best regards,  
      ${name}
      Sender's Email: ${email}  
    `,
    replyTo: email,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
