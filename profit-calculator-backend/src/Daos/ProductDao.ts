import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/Models/Entities/Product/ProductEntity";
import { Repository } from "typeorm";

@Injectable()
export class ProductDao {
    constructor(@InjectRepository(Product) private readonly _productRepository: Repository<Product>) { }

    async save(product: Product): Promise<void> {
        await this._productRepository.save(product);
    }

    async findOneByName(name: string, userId: number): Promise<Product> {
        const query = this._productRepository
            .createQueryBuilder('product')
            .where('product.name = :name', { name })
            .andWhere('product.user_id = :userId', { userId })
            .getOne();
        return query;
    }

    async findOneByUuid(uuid: string): Promise<Product> {
        const query = this._productRepository
            .createQueryBuilder('product')
            .where('product.uuid = :uuid', { uuid })
            .getOne();
        return query;
    }

    async findAll(userId: number): Promise<Product[]> {
        const query = this._productRepository
            .createQueryBuilder('product')
            .where('product.user_id = :userId', { userId })
            .getMany();
        return query;
    }

    async remove(product: Product): Promise<void> {
        await this._productRepository.remove(product);
    }
}