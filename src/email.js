const nodemailer = require('nodemailer');

const sendVerificationEmail = (token = '') => {
  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Message object
    let message = {
      from: 'Sender Name <sender@example.com>',
      to: 'Jose Igor <joseigorcfm@gmail.com>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Hello to myself!',
      html: `<p><b>Hello</b>!</p>
      <a href="http://localhost:3000/account/verifyEmail?token=${token}">Verification Token</a>`
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
};

module.exports = { sendVerificationEmail };
