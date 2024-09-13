import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { RoleDao } from "src/Daos/RoleDao";
import { UserDao } from "src/Daos/UserDao";
import { StatusCodeEnums } from "src/Enums/StatusCodeEnums";
import HttpCustomException from "src/Exceptions/HttpCustomException";
import { Role } from "src/Models/Entities/RoleEntity";
import { User } from "src/Models/Entities/User/UserEntity";
import CreateUserRequest from "src/Models/Request/UserController/CreateUserRequest";
import SuccessfulResponse from "src/Models/Response/SuccessfulResponse";
import UtilsFunctions from "src/Helpers/Utils/UtilsFunctions";

@Injectable()
export class UserService {
    constructor(
        private readonly _userDao: UserDao,
        private readonly _roleDao: RoleDao
    ) { }

    async create(data: CreateUserRequest): Promise<SuccessfulResponse> {
        this.validateUserData(data);

        try {
            await this.checkUserExists(data.email);
            const role = await this.getUserRole();

            const user = await this.createUserEntity(data, role);
            await this.saveUser(user);

            return new SuccessfulResponse('Usuario creado exitosamente');
        } catch (error) {
            this.handleCreateUserError(error);
        }
    }

    // Métodos privados para mejorar la legibilidad y mantenibilidad
    private validateUserData(data: CreateUserRequest): void {
        if (!data.email) throw new HttpCustomException('El email es requerido', StatusCodeEnums.EMAIL_REQUIRED);
        if (!data.name) throw new HttpCustomException('El nombre es requerido', StatusCodeEnums.NAME_REQUIRED);
        if (!data.password) throw new HttpCustomException('La contraseña es requerida', StatusCodeEnums.PASSWORD_REQUIRED);
    }

    private async checkUserExists(email: string): Promise<void> {
        const existingUser = await this._userDao.findByEmail(email);
        if (existingUser) {
            throw new HttpCustomException('El usuario ya existe', StatusCodeEnums.USER_ALREADY_EXISTS);
        }
    }

    private async getUserRole(): Promise<Role> {
        const role = await this._roleDao.findByName("USER");
        if (!role) {
            throw new HttpCustomException('Rol no encontrado', StatusCodeEnums.ROLE_NOT_FOUND);
        }
        return role;
    }

    private async createUserEntity(data: CreateUserRequest, role: Role): Promise<User> {
        const user = new User();
        user.setUuid(uuidv4());
        user.setName(data.name);
        user.setEmail(data.email);
        user.setPassword(await UtilsFunctions.getEncryptData(data.password));
        user.setVerificationCode(await UtilsFunctions.generateVerificationCode());
        user.setExpireVerificationCode(await UtilsFunctions.generateVerificationCode());
        user.setRoleId(role);
        user.setIsActive(true);
        return user;
    }

    private async saveUser(user: User): Promise<void> {
        try {
            await this._userDao.save(user);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new HttpCustomException(`Error al crear usuario: ${errorMessage}`, StatusCodeEnums.USER_CREATE_ERROR);
        }
    }

    private handleCreateUserError(error: unknown): never {
        if (error instanceof HttpCustomException) {
            throw error;
        }
        throw new HttpCustomException('Error al crear usuario', StatusCodeEnums.USER_CREATE_ERROR);
    }
}