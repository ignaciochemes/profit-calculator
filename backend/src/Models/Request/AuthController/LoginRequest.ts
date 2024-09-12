import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export default class LoginRequest {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}