import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { ISignUpRequest } from "../interfaces";


export class SignUpDto implements ISignUpRequest {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    phone?: string;
}