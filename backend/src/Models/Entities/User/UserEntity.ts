import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GenericTable } from '../GenericTable';
import { Role } from '../RoleEntity';

@Entity()
export class User extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index({ unique: true })
    @Column({ nullable: false, length: 255 })
    private uuid: string;

    @Column({ nullable: false, length: 255 })
    private name: string;

    @Column({ nullable: false, length: 255 })
    private email: string;

    @Column({ nullable: false, length: 255 })
    private password: string;

    @Column({ nullable: false, name: 'verification_code' })
    private verificationCode: string;

    @Column({ nullable: false, name: 'expire_verification_code' })
    private expireVerificationCode: string;

    @Column({ nullable: false, name: 'is_active', type: 'boolean', default: false })
    private isActive: boolean;

    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role_id' })
    private roleId: Role;

    @Column({ nullable: true, type: 'text', name: 'refresh_token' })
    private refreshToken: string;

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

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getVerificationCode(): string {
        return this.verificationCode;
    }

    public setVerificationCode(verificationCode: string): void {
        this.verificationCode = verificationCode;
    }

    public getExpireVerificationCode(): string {
        return this.expireVerificationCode;
    }

    public setExpireVerificationCode(expireVerificationCode: string): void {
        this.expireVerificationCode = expireVerificationCode;
    }

    public isIsActive(): boolean {
        return this.isActive;
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    public getRoleId(): Role {
        return this.roleId;
    }

    public setRoleId(roleId: Role): void {
        this.roleId = roleId;
    }

    public getRefreshToken(): string {
        return this.refreshToken;
    }

    public setRefreshToken(refreshToken: string): void {
        this.refreshToken = refreshToken;
    }
}
