import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';

import IEmailTransport from '../interfaces/email-transport.i';
import User from '../database/models/user.model';

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  transportDev: IEmailTransport;
  transportProd: IEmailTransport;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.full_name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.APP_NAME} team <${process.env.EMAIL_RESET}>`;
    this.transportDev = {
      host: process.env.EMAIL_HOST || '',
      port: Number(process.env.EMAIL_PORT) || 0,
      auth: {
        user: process.env.EMAIL_USERNAME || '',
        pass: process.env.EMAIL_PASSWORD || '',
      }
    };
    this.transportProd = {
      host: process.env.EMAIL_HOST || '',
      port: Number(process.env.EMAIL_PORT) || 0,
      auth: {
        user: process.env.EMAIL_USERNAME || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport(this.transportProd);
    }
    return nodemailer.createTransport(this.transportDev);
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    // 3) create a transport and send
    this.newTransport().sendMail(mailOptions, (error, info) => {
      // TODO: Hacer un mejor manejo de errores aqui
      console.error(error, info);
    });
  }

  async sendWelcome() {
    this.from = `${process.env.APP_NAME} team <${process.env.EMAIL_RESET}>`;
    await this.send('welcome', `Bienvenido a ${process.env.APP_NAME}`);
  }

  async sendPasswordReset() {
    this.from = `${process.env.APP_NAME} team <${process.env.EMAIL_RESET}>`;
    await this.send(
      'passwordReset',
      'solicitud de reinicio de contraseña (valido durante 10 minutos)'
    );
  }
};
