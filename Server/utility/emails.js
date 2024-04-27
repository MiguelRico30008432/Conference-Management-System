const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const emailFrom = process.env.EMAILFROM;
const emailPassword = process.env.EMAILPASSWORD;

function sendEmail(to, subject, replacements,file) {
    console.log(to);
    console.log(subject);
    console.log(replacements);
    console.log(file);
    const filePath = path.join(__dirname, 'emailTemplates', file);
    
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return;
        }
        
        // Substitutes variables in HTML File
        let htmlContent = html;
        for (let key in replacements) {
            htmlContent = htmlContent.replace(new RegExp(`{${key}}`, 'g'), replacements[key]);
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                    user: emailFrom,
                    pass: emailPassword
                }
            });

            const mailOptions = {
                from: emailFrom,
                to: to,
                subject: subject,
                html: htmlContent
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.error('Failed to send email:', error);
                }
                console.log('Email sent:', info.response);
            });
        } catch (error) {
            console.error('Nodemailer transport setup failed:', error);
        }
    });
}

module.exports = { sendEmail };