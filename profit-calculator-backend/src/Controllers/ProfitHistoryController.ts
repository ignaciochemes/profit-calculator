import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import Response from "src/Helpers/Formatter/Response";
import { JwtAuthGuard } from "src/Helpers/Middlewares/JwtAuthGuardMiddleware";
import CreateProfitHistoryRequest from "src/Models/Request/ProfitHistoryController/CreateProfitHistoryRequest";
import FindAllQueryProfitHistoryRequest from "src/Models/Request/ProfitHistoryController/FindAllQueryProfitHistoryRequest";
import CalculateProfitUniqueResponse from "src/Models/Response/ProfitHistoryController/CalculateProfitUniqueResponse";
import FindAllProfitHistoryResponse from "src/Models/Response/ProfitHistoryController/FinAllProfitHistoryResponse";
import SuccessfulResponse from "src/Models/Response/SuccessfulResponse";
import { ProfitHistoryService } from "src/Services/ProfitHistoryService";

@Controller('profit-history')
@UseGuards(JwtAuthGuard)
export class ProfitHistoryController {
    constructor(
        private readonly _profitHistoryService: ProfitHistoryService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Req() request: Request,
        @Body() body: CreateProfitHistoryRequest
    ): Promise<Response<SuccessfulResponse>> {
        const response = await this._profitHistoryService.create(body, request.user.uuid);
        return Response.create<SuccessfulResponse>(response);
    }

    @Get('/find/all')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() request: Request,
        @Query() query: FindAllQueryProfitHistoryRequest
    ): Promise<Response<FindAllProfitHistoryResponse>> {
        const response = await this._profitHistoryService.findAll(query, request.user.uuid);
        return Response.create<FindAllProfitHistoryResponse>(response);
    }

    @Get('/calculate/profit/unique/:uuid')
    @HttpCode(HttpStatus.OK)
    async calculateProfitUnique(
        @Param('uuid') uuid: string
    ): Promise<Response<CalculateProfitUniqueResponse>> {
        const response = await this._profitHistoryService.calculateProfitUnique(uuid);
        return Response.create<CalculateProfitUniqueResponse>(response);
    }
}