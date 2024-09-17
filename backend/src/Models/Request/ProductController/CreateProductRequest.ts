import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly isActive: boolean;

    @IsNumber()
    @IsNotEmpty()
    readonly cost: number;

    @IsNumber()
    @IsOptional()
    readonly costUsd: number;

    @IsNumber()
    @IsNotEmpty()
    readonly sellingPrice: number;

    @IsNumber()
    @IsOptional()
    readonly sellingPriceUsd: number;
}