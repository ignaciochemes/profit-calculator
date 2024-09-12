import { HistoryProfit } from "src/Models/Entities/ProfitHistory/ProfitHistoryEntity"

export default class FindAllProfitHistoryResponse {

    public profitHistory: HistoryProfit[];
    public totalPages: number;
    public currentPage: number;
    public totalItems: number;

    constructor(
        profitHistory: HistoryProfit[],
        totalPages: number,
        currentPage: number,
        totalItems: number
    ) {
        this.profitHistory = profitHistory;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
    }
}