import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GenericTable } from "./GenericTable";
import { User } from "./User/UserEntity";

@Entity()
export class ExchangeRate extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'varchar', length: 3 })
    private currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    private rate: number;

    @ManyToOne(() => User, (user) => user.id)
    private user: User;

    public getCurrency(): string {
        return this.currency;
    }

    public setCurrency(currency: string): void {
        this.currency = currency;
    }

    public getRate(): number {
        return this.rate;
    }

    public setRate(rate: number): void {
        this.rate = rate;
    }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User): void {
        this.user = user;
    }
}