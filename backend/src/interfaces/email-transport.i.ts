import { Options } from "nodemailer/lib/smtp-transport";

export default interface IEmailTransport extends Options {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  },
}