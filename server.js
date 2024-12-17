require('dotenv').config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
// The port
const PORT = 5000;

// The Middleware
app.use(cors());
app.use(bodyParser.json());

// The route
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
    from: email,
    to: "", 
    subject: "New Consultation Request",
    text: `
      Hello, Crown Agrovet LTD, I would love to book my consultation with you. 
      provided are my details, Kindly let me know if this time and date is okay by the Organization.
      Name: ${name}
      Email: ${email}
      Preferred Date: ${date}
      Meeting Type: ${meetingType}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
