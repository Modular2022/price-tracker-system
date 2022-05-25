import { Options } from "nodemailer/lib/smtp-transport";

export default interface IEmailTransport extends Options {
  host?: string;
  port?: number;
  service?: string;
  auth: {
    user?: string;
    pass?: string;
    api_key?: string;
    DEFAULT_FROM_EMAIL?: string;
    EMAIL_FROM?: string;
  },
}