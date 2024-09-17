import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/Models/Entities/RoleEntity";
import { Repository } from "typeorm";

@Injectable()
export class RoleDao {
    constructor(@InjectRepository(Role) private readonly _roleRepository: Repository<Role>) { }

    async findByName(name: string): Promise<Role> {
        const query = this._roleRepository
            .createQueryBuilder("role")
            .where("role.name = :name", { name })
            .getOne();
        return query;
    }
}