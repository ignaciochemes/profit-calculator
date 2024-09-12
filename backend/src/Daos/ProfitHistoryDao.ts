import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryProfit } from 'src/Models/Entities/ProfitHistory/ProfitHistoryEntity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfitHistoryDao {
    constructor(
        @InjectRepository(HistoryProfit) private readonly _profitHistoryRepository: Repository<HistoryProfit>
    ) { }

    async save(profitHistory: HistoryProfit): Promise<void> {
        await this._profitHistoryRepository.save(profitHistory);
    }

    async findAll(limit: number, offset: number, userId: number): Promise<HistoryProfit[]> {
        const query = this._profitHistoryRepository
            .createQueryBuilder('profitHistory')
            .leftJoinAndSelect('profitHistory.profitHistoryProducts', 'profitHistoryProduct')
            .leftJoinAndSelect('profitHistoryProduct.product', 'product')
            .leftJoin('profitHistoryProduct.user', 'user')
            .where('profitHistoryProduct.user_id = :userId', { userId })
            .orderBy('profitHistory.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany();
        return query;
    }

    async count(userId: number): Promise<number> {
        const query = this._profitHistoryRepository
            .createQueryBuilder('profitHistory')
            .leftJoinAndSelect('profitHistory.profitHistoryProducts', 'profitHistoryProduct')
            .leftJoinAndSelect('profitHistoryProduct.product', 'product')
            .leftJoin('profitHistoryProduct.user', 'user')
            .where('profitHistoryProduct.user_id = :userId', { userId })
            .getCount();
        return query;
    }

    async findOneByUuid(uuid: string): Promise<HistoryProfit> {
        const query = this._profitHistoryRepository
            .createQueryBuilder('profitHistory')
            .where('profitHistory.uuid = :uuid', { uuid })
            .innerJoinAndSelect('profitHistory.products', 'product')
            .getOne();
        return query;
    }
}