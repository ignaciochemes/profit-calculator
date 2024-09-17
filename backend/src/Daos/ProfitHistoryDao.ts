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

    async findAll(userId: number,limit: number, offset: number, dateIn?: string, dateOut?: string): Promise<HistoryProfit[]> {
        const query = this._profitHistoryRepository
            .createQueryBuilder('profitHistory')
            .leftJoinAndSelect('profitHistory.profitHistoryProducts', 'profitHistoryProduct')
            .leftJoinAndSelect('profitHistoryProduct.product', 'product')
            .leftJoin('profitHistoryProduct.user', 'user')
            .where('profitHistoryProduct.user_id = :userId', { userId })
            .orderBy('profitHistory.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        if (dateIn && dateOut) {
            query.andWhere('profitHistory.createdAt BETWEEN :dateIn AND :dateOut', { dateIn, dateOut })
        }
        return query.getMany();
    }

    async count(userId: number, dateIn?: string, dateOut?: string): Promise<number> {
        const query = this._profitHistoryRepository
            .createQueryBuilder('profitHistory')
            .leftJoinAndSelect('profitHistory.profitHistoryProducts', 'profitHistoryProduct')
            .leftJoinAndSelect('profitHistoryProduct.product', 'product')
            .leftJoin('profitHistoryProduct.user', 'user')
            .where('profitHistoryProduct.user_id = :userId', { userId });
        if (dateIn && dateOut) {
            query.andWhere('profitHistory.createdAt BETWEEN :dateIn AND :dateOut', { dateIn, dateOut })
        }
        return query.getCount();
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