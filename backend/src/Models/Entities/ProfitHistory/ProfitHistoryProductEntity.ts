import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { HistoryProfit } from "./ProfitHistoryEntity";
import { Product } from "../Product/ProductEntity";
import { GenericTable } from "../GenericTable";
import { User } from "../User/UserEntity";

@Entity()
export class ProfitHistoryProduct extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => HistoryProfit, (historyProfit) => historyProfit.profitHistoryProducts)
    public historyProfit: HistoryProfit;

    @ManyToOne(() => Product, (product) => product.id)
    private product: Product;

    @Column({ nullable: true, default: 0 })
    private quantity: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "user_id" })
    private user: User;

    public getHistoryProfit(): HistoryProfit {
        return this.historyProfit;
    }

    public setHistoryProfit(historyProfit: HistoryProfit): void {
        this.historyProfit = historyProfit;
    }

    public getProduct(): Product {
        return this.product;
    }

    public setProduct(product: Product): void {
        this.product = product;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User): void {
        this.user = user;
    }

}