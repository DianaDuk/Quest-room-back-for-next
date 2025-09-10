import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { ISignInRequest, ISignInResponse, ISignUpRequest } from "./interfaces";
import { AuthDataService } from "./auth-data.service";
import { EmailService } from "src/email/email.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OtpService } from "src/otp/otp.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly emailService: EmailService,
        private readonly authDataService: AuthDataService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ) {}

    async signUp(data: ISignUpRequest) {
        const existingUser = await this.authDataService.findUserByEmail(data.email);
        if(existingUser) {
            throw new BadRequestException ('Пользователь с таким email уже зарегистрирован')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
         await this.authDataService.createUser(data, hashedPassword);

         await this.emailService.sendEmail(
            data.email,
            'Добро пожаловать!',
            `Привет, ${data.name}! Ваш аккаунт успешно создан.`
         );
    } 


    async signIn(data: ISignInRequest): Promise<ISignInResponse>{
        const user = await this.authDataService.findUserByEmail(data.email);

        if(!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {id: user.id, role: user.role};

        const token = await this.jwtService.signAsync(payload);

        return {
            token: token,
            user: {
                name: user.name
            }
        };
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.authDataService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException ('Пользователь с таким email не найден');
        }

        const payload = {id: user.id, role: user.role};
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.emailService.sendEmail(
            email,
            'Сброс пароля',
            `Перейдите по ссылке для сброса пароля: ${resetLink}`,
        );
    }

    async resetPassword(token: string, newPassword: string) {
        try{
            const decoded = await this.jwtService.verifyAsync<{sub: number}>(token);
            const userId = decoded.sub;

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.authDataService.updateUserPassword(userId, hashedPassword)
        } catch (error) {
            throw new BadRequestException ('Неверный или просроченный токен');
        }
    }

    async VerifyResetSms(phone: string) {
        return this.otpService.sendOtp(phone);
    }

    async VerifyWithSms(phone: string, code: string) {
        return this.otpService.verifyOtp(phone, code);
    }

    async getUserById(id: number) {
    return this.authDataService.findUserById(id); 
}

    async updateUser(id: number, data: UpdateUserDto) {
    return this.authDataService.updateUser(id, data);
}
}