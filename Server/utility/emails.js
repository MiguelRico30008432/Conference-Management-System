const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const emailFrom = process.env.EMAILFROM;
const emailPassword = process.env.EMAILPASSWORD;

function sendEmail(to, subject, replacements, file, callback = (err) => {
    if (err) {
        console.error('Default callback error:', err);
    } else {
        console.log('Email sent successfully');
    }
}) {
  const filePath = path.join(__dirname, "emailTemplates", file);

  fs.readFile(filePath, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      console.error("Error reading HTML file:", err);
      return callback(err);
    }

    let htmlContent = html;
    for (let key in replacements) {
      let replacementText = replacements[key].replace(/\n/g, "<br>"); // Convert newlines to <br> tags
      htmlContent = htmlContent.replace(
        new RegExp(`{${key}}`, "g"),
        replacementText
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
          user: emailFrom,
          pass: emailPassword,
        },
      });

      const mailOptions = {
        from: emailFrom,
        to: to,
        subject: subject,
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return callback(error);
        }
        console.log("Email sent:", info.response);
        callback(null, info);
      });
    } catch (error) {
      console.error("Nodemailer transport setup failed:", error);
      callback(error);
    }
  });
}

module.exports = { sendEmail };