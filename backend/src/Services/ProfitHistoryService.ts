import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { ProductDao } from "src/Daos/ProductDao";
import { ProfitHistoryDao } from "src/Daos/ProfitHistoryDao";
import { Product } from "src/Models/Entities/Product/ProductEntity";
import CreateProfitHistoryRequest from "src/Models/Request/ProfitHistoryController/CreateProfitHistoryRequest";
import SuccessfulResponse from "src/Models/Response/SuccessfulResponse";
import FindAllProfitHistoryResponse from "src/Models/Response/ProfitHistoryController/FinAllProfitHistoryResponse";
import CalculateProfitUniqueResponse from "src/Models/Response/ProfitHistoryController/CalculateProfitUniqueResponse";
import { HistoryProfit } from "src/Models/Entities/ProfitHistory/ProfitHistoryEntity";
import { ProfitHistoryProduct } from "src/Models/Entities/ProfitHistory/ProfitHistoryProductEntity";
import { ProfitHistoryProductDao } from "src/Daos/ProfitHistoryProductDao";
import FindAllQueryProfitHistoryRequest from "src/Models/Request/ProfitHistoryController/FindAllQueryProfitHistoryRequest";
import { UserDao } from "src/Daos/UserDao";
import { User } from "src/Models/Entities/User/UserEntity";
import HttpCustomException from "src/Exceptions/HttpCustomException";
import { StatusCodeEnums } from "src/Enums/StatusCodeEnums";

@Injectable()
export class ProfitHistoryService {
    constructor(
        private readonly _profitHistoryDao: ProfitHistoryDao,
        private readonly _profitHistoryProductDao: ProfitHistoryProductDao,
        private readonly _productDao: ProductDao,
        private readonly _userDao: UserDao,
    ) { }

    async create(data: CreateProfitHistoryRequest, userUuid: string): Promise<SuccessfulResponse> {
        if (!data) {
            throw new Error('Data is required');
        }

        const findUser: User = await this._userDao.findByUuid(userUuid).catch(error => {
            if (error instanceof Error) {
                throw new Error(`Error finding user: ${error.message}`);
            } else {
                throw new Error('Error finding user');
            }
        })

        if (!findUser) {
            throw new HttpCustomException('User not found', StatusCodeEnums.USER_NOT_FOUND);
        }

        data.productsUuid.sort((a, b) => a.localeCompare(b));
        const quantities: { [key: string]: number } = {};
        for (const uuid of data.productsUuid) {
            quantities[uuid] = (quantities[uuid] || 0) + 1;
        }
        data.productsUuid = [...new Set(data.productsUuid)];

        const findProducts: ProfitHistoryProduct[] = [];
        const profitHistory: HistoryProfit = new HistoryProfit();
        profitHistory.setUuid(uuidv4());

        for (const uuid of data.productsUuid) {
            if (!uuid) {
                continue;
            }
            const product: Product = await this._productDao.findOneByUuid(uuid).catch(error => {
                if (error instanceof Error) {
                    throw new Error(`Error finding product: ${error.message}`);
                } else {
                    throw new Error('Error finding product');
                }
            });

            if (!product) {
                continue;
            }

            const profitHistoryProduct = new ProfitHistoryProduct();
            profitHistoryProduct.setProduct(product);
            profitHistoryProduct.setQuantity(quantities[uuid]);
            profitHistoryProduct.setHistoryProfit(profitHistory);
            profitHistoryProduct.setUser(findUser);
            findProducts.push(profitHistoryProduct);
        }

        if (findProducts.length === 0) {
            throw new Error('At least one product is required');
        }

        profitHistory.setProfitHistoryProducts(findProducts);

        try {
            await this._profitHistoryDao.save(profitHistory);
            return new SuccessfulResponse('Profit history created successfully');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error creating profit history: ${error.message}`);
            } else {
                throw new Error('Error creating profit history');
            }
        }
    }
    async findAll(query: FindAllQueryProfitHistoryRequest, userUuid: string): Promise<FindAllProfitHistoryResponse> {
        const findUser: User | null = await this._userDao.findByUuid(userUuid).catch(error => {
            if (error instanceof Error) {
                throw new Error(`Error finding user: ${error.message}`);
            } else {
                throw new Error('Error finding user');
            }
        })

        if (!findUser) {
            throw new HttpCustomException('User not found', StatusCodeEnums.USER_NOT_FOUND);
        }
        try {
            const profitHistories: HistoryProfit[] = await this._profitHistoryDao.findAll(query.limit, query.offset, findUser.id);
            const total: number = await this._profitHistoryDao.count(findUser.id);
            if (total === 0) {
                throw new Error('No profit histories found for the user');
            }
            const totalPages: number = Math.ceil(total / query.limit);
            const currentPage: number = Math.ceil((query.offset / query.limit) + 1);
            return new FindAllProfitHistoryResponse(
                profitHistories,
                totalPages,
                currentPage,
                total
            );


        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error finding profit histories: ${error.message}`);
            } else {
                throw new Error('Error finding profit histories');
            }
        }
    }



    async calculateProfitUnique(uuid: string): Promise<any> {
        // try {
        //     if (!uuid) {
        //         throw new Error('UUID is required');
        //     }

        //     const profitHistory: HistoryProfit | null = await this._profitHistoryDao.findOneByUuid(uuid).catch((error: Error) => {
        //         throw new Error(`Error finding profit history: ${error.message}`);
        //     });

        //     if (!profitHistory) {
        //         throw new Error('Profit history not found');
        //     }

        //     let profit: number = 0;
        //     let profitUsd: number = 0;
        //     if (profitHistory.getProducts) {
        //         for (const product of profitHistory.getProducts()) {
        //             if (product) {
        //                 profit += product.getSellingPrice() - product.getCost();
        //                 profitUsd += product.getSellingPriceUsd() - product.getCostUsd();
        //             }
        //         }
        //     }
        //     return new CalculateProfitUniqueResponse(profit, profitUsd);
        // } catch (error) {
        //     if (error instanceof Error) {
        //         throw new Error(`Error calculating profit: ${error.message}`);
        //     } else {
        //         throw new Error('Error calculating profit');
        //     }
        // }
    }
}