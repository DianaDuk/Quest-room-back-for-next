import { Injectable } from "@nestjs/common";
import * as Twilio  from "twilio";
import * as bcrypt from 'bcryptjs';
import { PrismaService } from "src/prisma.service";
import * as jwt from "jsonwebtoken";
import { JwtService } from "@nestjs/jwt";

interface OtpEntry {
    code: string;
    expiresAt: Date;
}

@Injectable()
export class OtpService {
    private otpStore: Map<string, OtpEntry> = new Map();
    private twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async sendOtp(phone: string) {
        if (!phone) {
        throw new Error('Номер телефона не передан');
        }

        const user = await this.prisma.user.findUnique({where: {phone}});
        if(!user) throw new Error('Пользователь не найден');

        const verification = await this.twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SID!)
        .verifications.create({ to: phone, channel: "sms" });

    return {
      message: `Код отправлен на ${phone}`,
      status: verification.status,
    }
}

    async verifyOtp(phone: string, code: string) {
      if (!phone || !code) {
        throw new Error("Телефон и код обязательны");
      }

      const check = await this.twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phone, code });

      if (check.status !== "approved") {
        throw new Error("Неверный или просроченный код");
      }

      const user = await this.prisma.user.findUnique({ where: { phone } });
      if (!user) throw new Error("Пользователь не найден");

      
      const token = this.jwtService.sign(
        {id: user.id, role: user.role},
        {expiresIn: "1d"}
      );

      return { message: "Авторизация успешна", token, user: {id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role,}};
    }
}