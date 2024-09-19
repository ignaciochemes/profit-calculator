import { Injectable } from "@nestjs/common";
import { UserDao } from "src/Daos/UserDao";
import { JwtSecurityService } from "./Security/JwtSecurityService";
import LoginRequest from "src/Models/Request/AuthController/LoginRequest";
import UtilsFunctions from "src/Helpers/Utils/UtilsFunctions";
import HttpCustomException from "src/Exceptions/HttpCustomException";
import { StatusCodeEnums } from "src/Enums/StatusCodeEnums";
import LoginResponse from "src/Models/Response/AuthController/LoginResponse";
import { User } from "src/Models/Entities/User/UserEntity";
import VerifyTokenResponse from "src/Models/Response/AuthController/VerifyTokenResponse";

@Injectable()
export class AuthService {
    constructor(
        private readonly _userDao: UserDao,
        private readonly _jwtSecurityService: JwtSecurityService
    ) { }

    async login(data: LoginRequest): Promise<LoginResponse> {
        this.validateLoginData(data);

        const user = await this.findUserByEmail(data.email);
        await this.validatePassword(data.password, user.getPassword());

        return await this.generateAndSaveTokens(user);
    }

    async verify(data: string): Promise<VerifyTokenResponse> {
        if (!data) {
            throw new HttpCustomException('Token no proporcionado', StatusCodeEnums.INVALID_CREDENTIALS);
        }
        const token = data.split(' ')[1];
        try {
            await this._jwtSecurityService.verifyRefreshToken(token);
            return new VerifyTokenResponse(true);
        } catch (error) {
            return new VerifyTokenResponse(false);
        }
    }

    private validateLoginData(data: LoginRequest): void {
        if (!data) {
            throw new HttpCustomException('Se requieren datos de inicio de sesión', StatusCodeEnums.INVALID_CREDENTIALS);
        }
    }

    private async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this._userDao.findByEmail(email);
            if (!user) {
                throw new HttpCustomException('Usuario no encontrado', StatusCodeEnums.INVALID_CREDENTIALS);
            }
            return user;
        } catch (error) {
            this.handleDatabaseError(error, 'Error al buscar usuario');
        }
    }

    private async validatePassword(inputPassword: string, storedPassword: string): Promise<void> {
        const isPasswordValid = await UtilsFunctions.getEncryptCompare(inputPassword, storedPassword);
        if (!isPasswordValid) {
            throw new HttpCustomException('El nombre de usuario o la contraseña son inválidos', StatusCodeEnums.INVALID_CREDENTIALS);
        }
    }

    private async generateAndSaveTokens(user: User): Promise<LoginResponse> {
        try {
            const accessToken = await this._jwtSecurityService.generateAccessToken(user.getUuid(), user.id);
            const refreshToken = await this._jwtSecurityService.generateRefreshToken(user.getUuid(), user.id);

            user.setRefreshToken(refreshToken);
            await this.saveUser(user);

            return new LoginResponse(accessToken, refreshToken);
        } catch (error) {
            this.handleTokenGenerationError(error);
        }
    }

    private async saveUser(user: User): Promise<void> {
        try {
            await this._userDao.save(user);
        } catch (error) {
            this.handleDatabaseError(error, 'Error al guardar usuario');
        }
    }

    private handleDatabaseError(error: unknown, message: string): never {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        throw new HttpCustomException(`${message}: ${errorMessage}`, StatusCodeEnums.INVALID_CREDENTIALS);
    }

    private handleTokenGenerationError(error: unknown): never {
        if (error instanceof HttpCustomException) {
            throw error;
        }
        throw new HttpCustomException('El nombre de usuario o la contraseña son inválidos', StatusCodeEnums.INVALID_CREDENTIALS);
    }
}