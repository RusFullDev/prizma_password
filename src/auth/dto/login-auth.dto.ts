import {  IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {

    @IsEmail()
    readonly email:string

    @IsNotEmpty()
    @IsString()
    readonly password:string
}
