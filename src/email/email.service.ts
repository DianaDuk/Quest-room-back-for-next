import { Injectable, Logger } from "@nestjs/common";
import * as sgMail from '@sendgrid/mail'

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name)

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;
        if(!apiKey) {
            throw new Error('SENDGRID_API_KEY is not set');
        }
        sgMail.setApiKey(apiKey);
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const msg = {
            to,
            from: process.env.EMAIL_FROM || 'dianadukelska@gmail.com',
            subject,
            text,
            html: html || `<p>${text}</p>`,
        };

        try {
            await sgMail.send(msg);
            this.logger.log(`Email sent to ${to}`);
        } catch (error) {
            this.logger.error('Error sending email', error.response?.body || error);
            throw error;
        }
    }

    async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
        const subject = 'Сброс пароля';
        const text = `Вы запросили сброс пароля. Перейдите по ссылке ниже, чтобы установить новый пароль:\n${resetLink}`;
        const html = `
            <p>Вы запросили сброс пароля.</p>
            <p>Нажмите на ссылку ниже, чтобы установить новый пароль:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            <p>Если вы не запрашивали сброс, проигнорируйте это письмо.</p>
        `;

        return this.sendEmail(to, subject, text, html);
    }
}