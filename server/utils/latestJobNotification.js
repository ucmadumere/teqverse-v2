const nodemailer = require('nodemailer');

const sendJobEmail = async (option) => {
    // CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST2,
        port: process.env.SMTP_PORT2,
        auth:{
            user: process.env.SMTP_USERNAME2,
            pass: process.env.SMTP_PASSWORD2
        }
    })

    // DEFINE EMAIL OPTIONS
    const emailOptions = {
        from: '<notifications@teqverse.com.ng>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
}

module.exports = sendJobEmail;

