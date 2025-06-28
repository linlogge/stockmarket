export interface StockHistory {
    labels: string[];
    data: number[];
}

class StockService {
    async getPortfolioHistory(): Promise<StockHistory> {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [124160.76, 124500.50, 124800.90, 124650.20, 125120.34, 125300.10, 125364.21]
        };
    }
}

export const stockService = new StockService(); 
