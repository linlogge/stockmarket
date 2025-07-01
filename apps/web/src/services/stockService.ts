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

export interface PricePoint {
    time: number;
    price: number;
}

export interface PriceInfo {
    price: number;
    diff: number;
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
        const response = await fetch('/api/emulate?locale=en-US');
        if (!response.ok) {
            throw new Error('Failed to fetch available stocks');
        }
        return await response.json();
    }

    async getCandles(symbol: string, resolution: "1D" | "1W" | "1M" | "1Y" | "5Y"): Promise<CandleResponse> {
        const to = new Date();
        const from = new Date();

        switch (resolution) {
            case '1D':
                from.setDate(to.getDate() - 1);
                break;
            case '1W':
                from.setDate(to.getDate() - 7);
                break;
            case '1M':
                from.setMonth(to.getMonth() - 1);
                break;
            case '1Y':
                from.setFullYear(to.getFullYear() - 1);
                break;
            case '5Y':
                from.setFullYear(to.getFullYear() - 5);
                break;
        }

        const toTimestamp = Math.floor(to.getTime() / 1000);
        const fromTimestamp = Math.floor(from.getTime() / 1000);
        
        const params = new URLSearchParams({
            from: fromTimestamp.toString(),
            to: toTimestamp.toString(),
        });

        const response = await fetch(`/api/emulate/${symbol}/history?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch candles for ${symbol}`);
        }
        
        const history: PricePoint[] = await response.json();
        
        return {
            s: 'ok',
            t: history.map(p => p.time),
            c: history.map(p => p.price),
            o: history.map(p => p.price),
            h: history.map(p => p.price),
            l: history.map(p => p.price),
            v: history.map(() => 0),
        };
    }

    async getStockPrice(symbol: string | string[]): Promise<StockPriceResponse> {
        const symbols = Array.isArray(symbol) ? symbol : [symbol];
        
        const responses = await Promise.all(symbols.map(async (s) => {
            const response = await fetch(`/api/emulate/${s}/price`);
            if (!response.ok) {
                // Return a null or error object to handle failed requests gracefully
                return { symbol: s, price: null, error: true };
            }
            const priceInfo: PriceInfo = await response.json();
            return { symbol: s, price: priceInfo.price, error: false };
        }));
    
        const successfulResponses = responses.filter(r => !r.error);
    
        return {
            symbol: successfulResponses.map(r => r.symbol),
            mid: successfulResponses.map(r => r.price as number),
            updated: successfulResponses.map(() => new Date().toISOString()),
        };
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
