export interface StockHistory {
    labels: string[];
    data: number[];
}

export interface Trade {
    symbol: string;
    quantity: number;
    action: string;
}

export interface Stock {
    symbol: string;
    company: string;
}

export interface PortfolioSummary {
    portfolio_value: number;
    days_gain: number;
    days_gain_percent: number;
}

class StockService {
    async getPortfolioHistory(): Promise<StockHistory> {
        const response = await fetch('/api/portfolio/history');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio history');
        }
        return await response.json();
    }

    async getPortfolioSummary(): Promise<PortfolioSummary> {
        const response = await fetch('/api/portfolio/summary');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio summary');
        }
        return await response.json();
    }

    async getAvailableStocks(): Promise<Stock[]> {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
            throw new Error('Failed to fetch available stocks');
        }
        return await response.json();
    }

    async submitTrade(trade: Trade) {
        const response = await fetch('/api/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trade),
        });

        if (!response.ok) {
            throw new Error('Trade submission failed');
        }

        return await response.json();
    }
}

export const stockService = new StockService(); 
