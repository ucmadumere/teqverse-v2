const nodemailer = require('nodemailer');

const sendVerifyEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST2,
        port: process.env.SMTP_PORT2,
        auth: {
            user: process.env.SMTP_USERNAME2,
            pass: process.env.SMTP_PASSWORD2,
        },
    });

    const emailOptions = {
        from: '<notifications@teqverse.com.ng>',
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing to the latest jobs at TeqVerse.',
    };

    await transporter.sendMail(emailOptions);
}

module.exports = sendVerifyEmail;