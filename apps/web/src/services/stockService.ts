export interface StockHistory {
    labels: string[];
    data: number[];
}

class StockService {
    async getPortfolioHistory(): Promise<StockHistory> {
        const response = await fetch('/api/portfolio/history');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio history');
        }
        return await response.json();
    }
}

export const stockService = new StockService(); 
