import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GenericTable } from "../GenericTable";
import { User } from "../User/UserEntity";

@Entity()
export class Product extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index({ unique: true })
    @Column({ nullable: false, length: 255 })
    private uuid: string;

    @Column({ nullable: false, length: 255 })
    private name: string;

    @Column({ nullable: false, name: 'is_active', type: 'boolean', default: false })
    private isActive: boolean;

    @Column({ nullable: false, name: 'is_delete', type: 'boolean', default: false })
    private isDelete: boolean;

    @Column({ nullable: true, default: 0, type: 'decimal', precision: 10, scale: 2 })
    private cost: number;

    @Column({ nullable: true, default: 0, name: 'cost_usd', type: 'decimal', precision: 10, scale: 2 })
    private costUsd: number;

    @Column({ nullable: true, default: 0, name: 'selling_price', type: 'decimal', precision: 10, scale: 2 })
    private sellingPrice: number;

    @Column({ nullable: true, default: 0, name: 'selling_price_usd', type: 'decimal', precision: 10, scale: 2 })
    private sellingPriceUsd: number;

    // generate relation with User
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    private user: User;

    public getUuid(): string {
        return this.uuid;
    }

    public setUuid(uuid: string): void {
        this.uuid = uuid;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public isIsActive(): boolean {
        return this.isActive;
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    public isIsDelete(): boolean {
        return this.isDelete;
    }

    public setIsDelete(isDelete: boolean): void {
        this.isDelete = isDelete;
    }

    public getCost(): number {
        return this.cost;
    }

    public setCost(cost: number): void {
        this.cost = cost;
    }

    public getCostUsd(): number {
        return this.costUsd;
    }

    public setCostUsd(costUsd: number): void {
        this.costUsd = costUsd;
    }

    public getSellingPrice(): number {
        return this.sellingPrice;
    }

    public setSellingPrice(sellingPrice: number): void {
        this.sellingPrice = sellingPrice;
    }

    public getSellingPriceUsd(): number {
        return this.sellingPriceUsd;
    }

    public setSellingPriceUsd(sellingPriceUsd: number): void {
        this.sellingPriceUsd = sellingPriceUsd;
    }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User): void {
        this.user = user;
    }

}