import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/Models/Entities/User/UserEntity";
import { Repository } from "typeorm";

@Injectable()
export class UserDao {
    constructor(@InjectRepository(User) private readonly _userRepository: Repository<User>) { }

    public async save(user: User): Promise<void> {
        await this._userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        const query = this._userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        return query;
    }

    async findByUuid(uuid: string): Promise<User> {
        const query = this._userRepository
            .createQueryBuilder("user")
            .where("user.uuid = :uuid", { uuid })
            .getOne();
        return query;
    }
}