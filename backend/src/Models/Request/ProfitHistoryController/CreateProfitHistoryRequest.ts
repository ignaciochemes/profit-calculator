import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export default class CreateProfitHistoryRequest {
    @IsNotEmpty()
    @IsNumber()
    readonly profit: number;

    @IsNotEmpty()
    @IsArray()
    productsUuid: string[];
}