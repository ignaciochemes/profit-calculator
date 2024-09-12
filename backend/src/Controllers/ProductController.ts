import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import Response from "src/Helpers/Formatter/Response";
import { JwtAuthGuard } from "src/Helpers/Middlewares/JwtAuthGuardMiddleware";
import CreateProductRequest from "src/Models/Request/ProductController/CreateProductRequest";
import FindAllResponse from "src/Models/Response/ProductController/FindAllResponse";
import FindOneByUuidResponse from "src/Models/Response/ProductController/FindOneByUuidResponse";
import SuccessfulResponse from "src/Models/Response/SuccessfulResponse";
import { ProductService } from "src/Services/ProductService";

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(
        private readonly _productService: ProductService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Req() req: Request,
        @Body() body: CreateProductRequest
    ): Promise<Response<SuccessfulResponse>> {
        const response = await this._productService.create(body, req.user.uuid);
        return Response.create<SuccessfulResponse>(response);
    }

    @Get('/find/unique/:uuid')
    @HttpCode(HttpStatus.OK)
    async findOneByUuid(
        @Param('uuid') uuid: string
    ): Promise<Response<FindOneByUuidResponse>> {
        const response = await this._productService.findOneByUuid(uuid);
        return Response.create<FindOneByUuidResponse>(response);
    }

    @Get('/find/all')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
    ): Promise<Response<FindAllResponse[]>> {
        const response = await this._productService.findAll(req.user.uuid);
        return Response.create<FindAllResponse[]>(response);
    }

    @Put('/update/:uuid')
    @HttpCode(HttpStatus.OK)
    async update(
        @Body() body: CreateProductRequest,
        @Param('uuid') uuid: string
    ): Promise<Response<SuccessfulResponse>> {
        const response = await this._productService.update(body, uuid);
        return Response.create<SuccessfulResponse>(response);
    }

    @Delete('/delete/:uuid')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('uuid') uuid: string
    ): Promise<Response<SuccessfulResponse>> {
        const response = await this._productService.delete(uuid);
        return Response.create<SuccessfulResponse>(response);
    }
}