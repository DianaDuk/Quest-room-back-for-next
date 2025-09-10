import { IsInt, IsISO8601, IsString, Min } from "class-validator";

export class CreateOrderDto {
    @IsInt()
    questId: number;

    @IsInt()
    @Min(2)
    participants: number;

    @IsISO8601()
    bookingDate: string;

    @IsString()
    name: string;

    @IsString()
    phone: string;
}