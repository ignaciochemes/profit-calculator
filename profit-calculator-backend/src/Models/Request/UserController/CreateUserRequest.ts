import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateUserRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    password: string;

}