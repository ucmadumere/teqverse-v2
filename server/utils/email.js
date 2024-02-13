const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    })

    // DEFINE EMAIL OPTIONS
    const emailOptions = {
        from: 'Teqverse support<noreply@teqverse.com.ng>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;