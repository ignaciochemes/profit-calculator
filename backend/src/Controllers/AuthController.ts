import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import Response from "src/Helpers/Formatter/Response";
import LoginRequest from "src/Models/Request/AuthController/LoginRequest";
import LoginResponse from "src/Models/Response/AuthController/LoginResponse";
import { AuthService } from "src/Services/AuthService";

@Controller("auth")
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() body: LoginRequest
    ): Promise<Response<LoginResponse>> {
        const response = await this._authService.login(body);
        return Response.create<LoginResponse>(response);
    }

}