import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { ProductDao } from "src/Daos/ProductDao";
import CreateProductRequest from "src/Models/Request/ProductController/CreateProductRequest";
import SuccessfulResponse from "src/Models/Response/SuccessfulResponse";
import FindOneByUuidResponse from "src/Models/Response/ProductController/FindOneByUuidResponse";
import HttpCustomException from "src/Exceptions/HttpCustomException";
import { StatusCodeEnums } from "src/Enums/StatusCodeEnums";
import { Product } from "src/Models/Entities/Product/ProductEntity";
import FindAllResponse from "src/Models/Response/ProductController/FindAllResponse";
import { User } from "src/Models/Entities/User/UserEntity";
import { UserDao } from "src/Daos/UserDao";

@Injectable()
export class ProductService {
    constructor(
        private readonly _productDao: ProductDao,
        private readonly _userDao: UserDao
    ) { }

    /**
    * Crea un nuevo producto.
    * @param {CreateProductRequest} data - Datos del producto a crear.
    * @returns {Promise<SuccessfulResponse>}
    * @throws {HttpCustomException} - Si ocurre un error durante la creación del producto.
    */
    async create(data: CreateProductRequest, userUuid: string): Promise<SuccessfulResponse> {
        if (!data) {
            throw new HttpCustomException('Data is required', StatusCodeEnums.DATA_REQUIRED);
        }

        if (!data.name) {
            throw new HttpCustomException('Name is required', StatusCodeEnums.NAME_REQUIRED);
        }

        if (!userUuid) {
            throw new HttpCustomException('User UUID is required', StatusCodeEnums.UUID_REQUIRED);
        }

        try {
            const findUser: User = await this._userDao.findByUuid(userUuid).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error finding user: ${error.message}`, StatusCodeEnums.USER_NOT_FOUND);
                } else {
                    throw new HttpCustomException('Error finding user', StatusCodeEnums.USER_NOT_FOUND);
                }
            })

            if (!findUser) {
                throw new HttpCustomException('User not found', StatusCodeEnums.USER_NOT_FOUND);
            }

            const findProduct: Product = await this._productDao.findOneByName(data.name, findUser.id).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error finding product: ${error.message}`, StatusCodeEnums.PRODUCT_NOT_FOUND);
                } else {
                    throw new HttpCustomException('Error finding product', StatusCodeEnums.PRODUCT_NOT_FOUND);
                }
            })

            if (findProduct) {
                throw new HttpCustomException('Product already exists', StatusCodeEnums.PRODUCT_EXISTS);
            }

            const newProduct: Product = new Product();
            newProduct.setUuid(uuidv4());
            newProduct.setName(data.name);
            newProduct.setIsActive(true);
            newProduct.setIsDelete(false);
            newProduct.setCost(data.cost);
            newProduct.setCostUsd(data.costUsd);
            newProduct.setSellingPrice(data.sellingPrice);
            newProduct.setSellingPriceUsd(data.sellingPriceUsd);
            newProduct.setUser(findUser);

            await this._productDao.save(newProduct).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error creating product variant: ${error.message}`, StatusCodeEnums.PRODUCT_CREATION_ERROR);
                } else {
                    throw new HttpCustomException('Error creating product variant', StatusCodeEnums.PRODUCT_CREATION_ERROR);
                }
            });

            return new SuccessfulResponse('Product created successfully');
        } catch (error) {
            if (error instanceof HttpCustomException) {
                throw error;
            } else {
                throw new HttpCustomException('Error creating product', StatusCodeEnums.PRODUCT_CREATION_ERROR);
            }
        }
    }

    /**
    * Busca un producto por su UUID.
    * @param {string} uuid - UUID del producto a buscar.
    * @returns {Promise<FindOneByUuidResponse>}
    * @throws Error - Si el producto no se encuentra.
    */
    async findOneByUuid(uuid: string): Promise<FindOneByUuidResponse> {
        try {
            if (!uuid) {
                throw new HttpCustomException('UUID is required.', StatusCodeEnums.UUID_REQUIRED);
            }

            const product: Product | undefined = await this._productDao.findOneByUuid(uuid);

            if (!product) {
                throw new HttpCustomException('Product not found', StatusCodeEnums.PRODUCT_NOT_FOUND);
            }

            return new FindOneByUuidResponse(product);
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpCustomException(`Error finding product by UUID: ${error.message}`, StatusCodeEnums.PRODUCT_FIND_ERROR);
            } else {
                throw new HttpCustomException('Error finding product by UUID', StatusCodeEnums.PRODUCT_FIND_ERROR);
            }
        }
    }

    async findAll(userUuid: string): Promise<FindAllResponse[]> {
        const findUser: User = await this._userDao.findByUuid(userUuid).catch(error => {
            if (error instanceof Error) {
                throw new HttpCustomException(`Error finding user: ${error.message}`, StatusCodeEnums.USER_NOT_FOUND);
            } else {
                throw new HttpCustomException('Error finding user', StatusCodeEnums.USER_NOT_FOUND);
            }
        })

        if (!findUser) {
            throw new HttpCustomException('User not found', StatusCodeEnums.USER_NOT_FOUND);
        }

        try {
            const products: Product[] = await this._productDao.findAll(findUser.id);
            return products.map(product => new FindAllResponse(product));
        } catch (error) {
            if (error instanceof Error) {
                throw new HttpCustomException(`Error finding products: ${error.message}`, StatusCodeEnums.PRODUCT_FIND_ERROR);
            } else {
                throw new HttpCustomException('Error finding products', StatusCodeEnums.PRODUCT_FIND_ERROR);
            }
        }
    }

    async update(data: CreateProductRequest, uuid: string): Promise<SuccessfulResponse> {
        try {
            if (!data.name) {
                throw new HttpCustomException('Name is required', StatusCodeEnums.NAME_REQUIRED);
            }

            const findProduct: Product = await this._productDao.findOneByUuid(uuid).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error finding product: ${error.message}`, StatusCodeEnums.PRODUCT_NOT_FOUND);
                } else {
                    throw new HttpCustomException('Error finding product', StatusCodeEnums.PRODUCT_NOT_FOUND);
                }
            })

            if (!findProduct) {
                throw new HttpCustomException('Product not found', StatusCodeEnums.PRODUCT_NOT_FOUND);
            }

            findProduct.setName(data.name);
            findProduct.setCost(data.cost);
            findProduct.setCostUsd(data.costUsd);
            findProduct.setSellingPrice(data.sellingPrice);
            findProduct.setSellingPriceUsd(data.sellingPriceUsd);

            await this._productDao.save(findProduct).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error updating product: ${error.message}`, StatusCodeEnums.PRODUCT_UPDATE_ERROR);
                } else {
                    throw new HttpCustomException('Error updating product', StatusCodeEnums.PRODUCT_UPDATE_ERROR);
                }
            });

            return new SuccessfulResponse('Product updated successfully');
        } catch (error) {
            if (error instanceof HttpCustomException) {
                throw error;
            } else {
                throw new HttpCustomException('Error updating product', StatusCodeEnums.PRODUCT_UPDATE_ERROR);
            }
        }
    }

    async delete(uuid: string): Promise<SuccessfulResponse> {
        try {
            if (!uuid) {
                throw new HttpCustomException('UUID is required.', StatusCodeEnums.UUID_REQUIRED);
            }

            const findProduct: Product = await this._productDao.findOneByUuid(uuid).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error finding product: ${error.message}`, StatusCodeEnums.PRODUCT_NOT_FOUND);
                } else {
                    throw new HttpCustomException('Error finding product', StatusCodeEnums.PRODUCT_NOT_FOUND);
                }
            })

            if (!findProduct) {
                throw new HttpCustomException('Product not found', StatusCodeEnums.PRODUCT_NOT_FOUND);
            }

            await this._productDao.remove(findProduct).catch(error => {
                if (error instanceof Error) {
                    throw new HttpCustomException(`Error deleting product: ${error.message}`, StatusCodeEnums.PRODUCT_DELETE_ERROR);
                } else {
                    throw new HttpCustomException('Error deleting product', StatusCodeEnums.PRODUCT_DELETE_ERROR);
                }
            });

            return new SuccessfulResponse('Product deleted successfully');
        } catch (error) {
            if (error instanceof HttpCustomException) {
                throw error;
            } else {
                throw new HttpCustomException('Error deleting product', StatusCodeEnums.PRODUCT_DELETE_ERROR);
            }
        }
    }
}