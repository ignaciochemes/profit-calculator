import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";
import { QUERY_MAX_LIMIT, QUERY_MIN_OFFSET } from "src/Constants/GenericConstants";

export default class FindAllQueryProfitHistoryRequest {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @Max(QUERY_MAX_LIMIT)
    public limit = 8;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(QUERY_MIN_OFFSET)
    public offset = 0;
}