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

    async create(data: CreateProductRequest, userUuid: string): Promise<SuccessfulResponse> {
        this.validateCreateData(data, userUuid);

        try {
            const user = await this.findUserByUuid(userUuid);
            await this.checkProductExists(data.name, user.id);

            const newProduct = this.createProductEntity(data, user);
            await this.saveProduct(newProduct);

            return new SuccessfulResponse('Producto creado exitosamente');
        } catch (error) {
            this.handleCreateError(error);
        }
    }

    async findOneByUuid(uuid: string): Promise<FindOneByUuidResponse> {
        this.validateUuid(uuid);

        try {
            const product = await this.findProductByUuid(uuid);
            return new FindOneByUuidResponse(product);
        } catch (error) {
            this.handleFindError(error);
        }
    }

    async findAll(userUuid: string): Promise<FindAllResponse[]> {
        const user = await this.findUserByUuid(userUuid);

        try {
            const products = await this._productDao.findAll(user.id);
            return products.map(product => new FindAllResponse(product));
        } catch (error) {
            this.handleFindError(error);
        }
    }

    async update(data: CreateProductRequest, uuid: string): Promise<SuccessfulResponse> {
        this.validateUpdateData(data, uuid);

        try {
            const product = await this.findProductByUuid(uuid);
            this.updateProductEntity(product, data);
            await this.saveProduct(product);

            return new SuccessfulResponse('Producto actualizado exitosamente');
        } catch (error) {
            this.handleUpdateError(error);
        }
    }

    async delete(uuid: string): Promise<SuccessfulResponse> {
        this.validateUuid(uuid);

        try {
            const product = await this.findProductByUuid(uuid);
            await this._productDao.remove(product);

            return new SuccessfulResponse('Producto eliminado exitosamente');
        } catch (error) {
            this.handleDeleteError(error);
        }
    }

    private validateCreateData(data: CreateProductRequest, userUuid: string): void {
        if (!data) throw new HttpCustomException('Se requieren datos', StatusCodeEnums.DATA_REQUIRED);
        if (!data.name) throw new HttpCustomException('El nombre es requerido', StatusCodeEnums.NAME_REQUIRED);
        if (!userUuid) throw new HttpCustomException('Se requiere UUID de usuario', StatusCodeEnums.UUID_REQUIRED);
    }

    private validateUpdateData(data: CreateProductRequest, uuid: string): void {
        if (!data.name) throw new HttpCustomException('El nombre es requerido', StatusCodeEnums.NAME_REQUIRED);
        this.validateUuid(uuid);
    }

    private validateUuid(uuid: string): void {
        if (!uuid) throw new HttpCustomException('Se requiere UUID', StatusCodeEnums.UUID_REQUIRED);
    }

    // Métodos privados de búsqueda
    private async findUserByUuid(userUuid: string): Promise<User> {
        const user = await this._userDao.findByUuid(userUuid);
        if (!user) throw new HttpCustomException('Usuario no encontrado', StatusCodeEnums.USER_NOT_FOUND);
        return user;
    }

    private async findProductByUuid(uuid: string): Promise<Product> {
        const product = await this._productDao.findOneByUuid(uuid);
        if (!product) throw new HttpCustomException('Producto no encontrado', StatusCodeEnums.PRODUCT_NOT_FOUND);
        return product;
    }

    private async checkProductExists(name: string, userId: number): Promise<void> {
        const existingProduct = await this._productDao.findOneByName(name, userId);
        if (existingProduct) throw new HttpCustomException('El producto ya existe', StatusCodeEnums.PRODUCT_EXISTS);
    }

    // Métodos privados de creación y actualización de entidades
    private createProductEntity(data: CreateProductRequest, user: User): Product {
        const newProduct = new Product();
        newProduct.setUuid(uuidv4());
        this.updateProductEntity(newProduct, data);
        newProduct.setIsActive(true);
        newProduct.setIsDelete(false);
        newProduct.setUser(user);
        return newProduct;
    }

    private updateProductEntity(product: Product, data: CreateProductRequest): void {
        product.setName(data.name);
        product.setCost(data.cost);
        product.setCostUsd(data.costUsd);
        product.setSellingPrice(data.sellingPrice);
        product.setSellingPriceUsd(data.sellingPriceUsd);
    }

    // Método privado de guardado
    private async saveProduct(product: Product): Promise<void> {
        try {
            await this._productDao.save(product);
        } catch (error) {
            throw new HttpCustomException('Error al guardar el producto', StatusCodeEnums.PRODUCT_CREATION_ERROR);
        }
    }

    // Métodos privados de manejo de errores
    private handleCreateError(error: unknown): never {
        if (error instanceof HttpCustomException) throw error;
        throw new HttpCustomException('Error al crear el producto', StatusCodeEnums.PRODUCT_CREATION_ERROR);
    }

    private handleFindError(error: unknown): never {
        if (error instanceof HttpCustomException) throw error;
        throw new HttpCustomException('Error al buscar el producto', StatusCodeEnums.PRODUCT_FIND_ERROR);
    }

    private handleUpdateError(error: unknown): never {
        if (error instanceof HttpCustomException) throw error;
        throw new HttpCustomException('Error al actualizar el producto', StatusCodeEnums.PRODUCT_UPDATE_ERROR);
    }

    private handleDeleteError(error: unknown): never {
        if (error instanceof HttpCustomException) throw error;
        throw new HttpCustomException('Error al eliminar el producto', StatusCodeEnums.PRODUCT_DELETE_ERROR);
    }
}