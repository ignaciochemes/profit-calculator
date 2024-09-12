import { Injectable } from "@nestjs/common";
import { UserDao } from "src/Daos/UserDao";
import { JwtSecurityService } from "./Security/JwtSecurityService";
import LoginRequest from "src/Models/Request/AuthController/LoginRequest";
import UtilsFunctions from "src/Helpers/Utils/UtilsFunctions";
import HttpCustomException from "src/Exceptions/HttpCustomException";
import { StatusCodeEnums } from "src/Enums/StatusCodeEnums";
import LoginResponse from "src/Models/Response/AuthController/LoginResponse";

@Injectable()
export class AuthService {
    constructor(
        private readonly _userDao: UserDao,
        private readonly _jwtSecurityService: JwtSecurityService
    ) { }

    async login(data: LoginRequest): Promise<LoginResponse> {
        if (!data) {
            throw new HttpCustomException('Data is required', StatusCodeEnums.INVALID_CREDENTIALS);
        }

        const findUser = await this._userDao.findByEmail(data.email).catch(error => {
            if (error instanceof Error) {
                throw new HttpCustomException(`Error finding user: ${error.message}`, StatusCodeEnums.INVALID_CREDENTIALS);
            } else {
                throw new HttpCustomException('Error finding user', StatusCodeEnums.INVALID_CREDENTIALS);
            }
        });

        if (!findUser) {
            throw new HttpCustomException('User not found', StatusCodeEnums.INVALID_CREDENTIALS);
        }

        if (!(await UtilsFunctions.getEncryptCompare(data.password, findUser.getPassword()))) {
            throw new HttpCustomException('The username or password is invalid', StatusCodeEnums.INVALID_CREDENTIALS);
        }

        try {
            const accessToken = await this._jwtSecurityService.generateAccessToken(findUser.getUuid(), findUser.id);
            const refreshToken = await this._jwtSecurityService.generateRefreshToken(findUser.getUuid(), findUser.id);
            findUser.setRefreshToken(refreshToken);
            await this._userDao.save(findUser).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error saving user: ${error.message}`, StatusCodeEnums.INVALID_CREDENTIALS);
                } else {
                    throw new HttpCustomException('Error saving user', StatusCodeEnums.INVALID_CREDENTIALS);
                }
            });
            return new LoginResponse(accessToken, refreshToken);
        } catch (error) {
            if (error instanceof HttpCustomException) {
                throw error;
            } else {
                throw new HttpCustomException(`The username or password is invalid`, StatusCodeEnums.INVALID_CREDENTIALS);
            }
        }
    }

}