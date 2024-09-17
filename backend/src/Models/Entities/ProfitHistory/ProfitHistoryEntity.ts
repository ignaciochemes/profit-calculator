import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GenericTable } from "../GenericTable";
import { ProfitHistoryProduct } from "./ProfitHistoryProductEntity";

@Entity()
export class HistoryProfit extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index({ unique: true })
    @Column({ nullable: false, length: 255 })
    private uuid: string;

    @OneToMany(() => ProfitHistoryProduct, (profitHistoryProduct) => profitHistoryProduct.historyProfit, {
        cascade: true,
    })
    public profitHistoryProducts: ProfitHistoryProduct[];

    public getUuid(): string {
        return this.uuid;
    }

    public setUuid(uuid: string): void {
        this.uuid = uuid;
    }

    public getProfitHistoryProducts(): ProfitHistoryProduct[] {
        return this.profitHistoryProducts;
    }

    public setProfitHistoryProducts(profitHistoryProducts: ProfitHistoryProduct[]): void {
        this.profitHistoryProducts = profitHistoryProducts;
    }

}