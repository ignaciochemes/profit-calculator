import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { GenericTable } from "./GenericTable";

@Entity()
export class Role extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index({ unique: true })
    @Column({ nullable: false, length: 255 })
    private name: string;

    @Column({ nullable: false, length: 255 })
    private description: string;

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
}