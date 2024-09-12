import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfitHistoryProduct } from "src/Models/Entities/ProfitHistory/ProfitHistoryProductEntity";
import { Repository } from "typeorm";

@Injectable()
export class ProfitHistoryProductDao {
    constructor(@InjectRepository(ProfitHistoryProduct) private readonly _profitHistoryProductRepository: Repository<ProfitHistoryProduct>) { }

    async findAllByHistoryProfitId(historyProfitId: number): Promise<ProfitHistoryProduct[]> {
        const query = this._profitHistoryProductRepository
            .createQueryBuilder('profitHistoryProduct')
            .innerJoinAndSelect('profitHistoryProduct.product', 'product')
            .where('profitHistoryProduct.historyProfitId = :historyProfitId', { historyProfitId })
            .getMany();
        return query;
    }
}