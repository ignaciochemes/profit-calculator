import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import Response from "src/Helpers/Formatter/Response";
import CreateUserRequest from "src/Models/Request/UserController/CreateUserRequest";
import { UserService } from "src/Services/UserService";

@Controller("user")
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateUserRequest
    ): Promise<Response<any>> {
        const response = await this._userService.create(body);
        return Response.create<any>(response);
    }
}