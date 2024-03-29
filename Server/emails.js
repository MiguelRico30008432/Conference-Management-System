
const emailFrom = process.env.EMAILFROM;
const emailPassword = process.env.EMAILPASSWORD;

function sendEmail(mail, subject, content) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: emailFrom,
                pass: emailPassword
            }
        });

        const mailOptions = {from: emailFrom, to: mail, subject: subject, text: content};

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log("Email error: " + error);
    }
}

module.exports = {
    sendEmail
}