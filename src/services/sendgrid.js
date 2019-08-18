const sendgridMail = require("@sendgrid/mail");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sendgridMail.send({
    to: email,
    from: "pessoa.pedro91@gmail.com",
    subject: "Thanks for joining!",
    text: `Welcome ${name}`
  });
};

const sendRetentionEmail = (email, name) => {
  sendgridMail.send({
    to: email,
    from: "pessoa.pedro91@gmail.com",
    subject: "Farewell!",
    text: `Bye ${name} :(`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendRetentionEmail
};
