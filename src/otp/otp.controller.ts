import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { OtpService } from "./otp.service";


@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

        @Post('send')
        @HttpCode(HttpStatus.OK)
        async sendOtp(@Body('phone') phone: string) {
            return await this.otpService.sendOtp(phone);
        }

        @Post('verify')
        @HttpCode(HttpStatus.OK)
        async verifyOtp (
            @Body('phone') phone: string,
            @Body('code') code: string,
        ) {
            return await this.otpService.verifyOtp(phone, code);
        }
}