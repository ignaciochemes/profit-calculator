export default class CalculateProfitUniqueResponse {
    public profit: number;
    public profitUsd: number;

    public constructor(profit: number, profitUsd: number) {
        this.profit = profit;
        this.profitUsd = profitUsd;
    }
}