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
        if (!data.email) {
            throw new HttpCustomException('Email is required', StatusCodeEnums.EMAIL_REQUIRED);
        }
        if (!data.name) {
            throw new HttpCustomException('Name is required', StatusCodeEnums.NAME_REQUIRED);
        }
        if (!data.password) {
            throw new HttpCustomException('Password is required', StatusCodeEnums.PASSWORD_REQUIRED);
        }

        try {
            const findUser: User | null = await this._userDao.findByEmail(data.email);
            if (findUser) {
                throw new HttpCustomException('User already exist', StatusCodeEnums.USER_ALREADY_EXISTS);
            }
            const findRole: Role | null = await this._roleDao.findByName("USER");
            if (!findRole) {
                throw new HttpCustomException('Role not found', StatusCodeEnums.ROLE_NOT_FOUND);
            }

            const user: User = new User();
            user.setUuid(uuidv4());
            user.setName(data.name);
            user.setEmail(data.email);
            user.setPassword(await UtilsFunctions.getEncryptData(data.password));
            user.setVerificationCode(await UtilsFunctions.generateVerificationCode());
            user.setExpireVerificationCode(await UtilsFunctions.generateVerificationCode());
            user.setRoleId(findRole);
            user.setIsActive(true);
            await this._userDao.save(user).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error creating user: ${error.message}`, StatusCodeEnums.USER_CREATE_ERROR);
                } else {
                    throw new HttpCustomException('Error creating user', StatusCodeEnums.USER_CREATE_ERROR);
                }
            });

            return new SuccessfulResponse('User created successfully');
        } catch (error) {
            if (error instanceof HttpCustomException) {
                throw error;
            }
            throw new HttpCustomException('Error creating user', StatusCodeEnums.USER_CREATE_ERROR);
        }
    }
}