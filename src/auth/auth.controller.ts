import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthGuard } from "@nestjs/passport";
import { ISignInResponse } from "./interfaces";
import { Response } from 'express';
import { UpdateUserDto } from "./dto/update-user.dto";

class ForgotPasswordDto {
    email: string;
}

class ResetPasswordDto {
    token: string;
    newPassword: string;
}

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}
    
    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto:SignUpDto): Promise<void> {
        return this.authService.signUp(dto);
   }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() dto: SignInDto): Promise<ISignInResponse> {
        return this.authService.signIn(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Req() req) {
    const userId = req.user.id;
    return this.authService.getUserById(userId);
    }


    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{message: string}> {
        await this.authService.sendPasswordResetEmail(dto.email);
        return {message: 'Ссылка для сброса пароля отправлена на email, если он существует в системе'}; 
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto): Promise<{message:string}> {
        await this.authService.resetPassword(dto.token, dto.newPassword);
        return {message: 'Пароль успешно обновлен'};
    }

    @Post('verify-reset-sms')
    async forgotPasswordSms(@Body('phone') phone: string) {
        return this.authService.VerifyResetSms(phone);
    }

    @Post('verify-with-sms')
    async resetPasswordSms(
        @Body('phone') phone: string,
        @Body('code') code: string,
    ) {
        return this.authService.VerifyWithSms(phone, code);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    async updateProfile(@Req() req, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(req.user.id, body);
    }

}
