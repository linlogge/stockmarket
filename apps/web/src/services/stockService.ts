import { authService } from "./authService";

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

export interface StockPriceResponse {
    symbol: string[];
    mid: number[];
    updated: string[];
}

export interface CandleResponse {
    s: string;
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    t: number[];
    v: number[];
}

export interface PortfolioSummary {
    portfolio_value: number;
    days_gain: number;
    days_gain_percent: number;
}

class StockService {
    private getAuthHeaders(): HeadersInit {
        const token = authService.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async getPortfolioHistory(): Promise<StockHistory> {
        const response = await fetch('/api/portfolio/history', {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio history');
        }
        return await response.json();
    }

    async getPortfolioSummary(): Promise<PortfolioSummary> {
        const response = await fetch('/api/portfolio/summary', {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio summary');
        }
        return await response.json();
    }

    async getAvailableStocks(): Promise<Stock[]> {
        const response = await fetch('/api/stocks', {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch available stocks');
        }
        return await response.json();
    }

    async getCandles(symbol: string, resolution: "1D" | "1W" | "1M" | "1Y" | "5Y"): Promise<CandleResponse> {
        const response = await fetch(`/api/marketdata/stocks/candles/${resolution}/${symbol}`, {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch candles for ${symbol}`);
        }
        return await response.json();
    }

    async getStockPrice(symbol: string | string[]): Promise<StockPriceResponse> {
        const symbolParam = Array.isArray(symbol) ? symbol.join(',') : symbol;
        const response = await fetch(`/api/marketdata/stocks/prices/${symbolParam}`, {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch price for ${symbolParam}`);
        }
        return await response.json();
    }

    async getTransactions(): Promise<Trade[]> {
        const response = await fetch('/api/transactions', {
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        return await response.json();
    }

    async submitTrade(trade: Trade) {
        const response = await fetch('/api/trade', {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(trade),
        });

        if (!response.ok) {
            throw new Error('Trade submission failed');
        }

        return await response.json();
    }
}

export const stockService = new StockService(); 
