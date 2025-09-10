import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AuthDataService } from "./auth-data.service";
import { EmailModule } from "src/email/email.module";
import { OtpModule } from "src/otp/otp.module";


@Module({
    imports: [EmailModule,
        OtpModule,
        JwtModule.register({
            secret: 'supersecretkey',
            signOptions: {expiresIn: '30d'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthDataService, PrismaService, JwtStrategy],
})
export class AuthModule {}