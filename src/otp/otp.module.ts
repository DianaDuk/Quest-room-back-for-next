import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";
import { PrismaService } from "src/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            secret: 'supersecretkey',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [OtpService, PrismaService],
    controllers: [OtpController],
    exports: [OtpService]
})

export class OtpModule {}