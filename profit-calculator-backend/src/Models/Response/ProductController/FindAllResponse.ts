import { Product } from "src/Models/Entities/Product/ProductEntity";

export default class FindAllResponse {
    public createdAt: Date;
    public updatedAt: Date;
    public uuid: string;
    public name: string;
    public isActive: boolean;
    public cost: number;
    public costUsd: number;
    public sellingPrice: number;
    public sellingPriceUsd: number;

    constructor(product: Product) {
        this.createdAt = product.createdAt ?? null;
        this.updatedAt = product.updatedAt ?? null;
        this.uuid = product.getUuid() ?? null;
        this.name = product.getName() ?? null;
        this.isActive = product.isIsActive() ?? null;
        this.cost = product.getCost() ?? null;
        this.costUsd = product.getCostUsd() ?? null;
        this.sellingPrice = product.getSellingPrice() ?? null;
        this.sellingPriceUsd = product.getSellingPriceUsd() ?? null;
    }
}