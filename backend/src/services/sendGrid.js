require('dotenv').config();
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SEND_GRI_API_KEY);

class SendGrid {
  sendMail(emailOptions) {
    emailOptions.from = process.env.APP_EMAIL;
    return sgMail.send(emailOptions);
  }
}

export default new SendGrid();
