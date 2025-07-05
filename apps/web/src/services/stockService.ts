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

// Backend price response shape.
interface BackendPriceInfo {
    symbol: string;
    mid: number;
}

// Internal structure used by UI after diff calculation.
export interface PriceInfo {
    price: number;
    diff: number;
}

export interface StockPriceResponse {
    symbol: string[];
    mid: number[];
    updated: string[];
    diff: number[];
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

// Historical candle returned by backend emulator.
interface BackendHistory {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number;
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

    async getAvailableStocks(countryCode?: "US" | "DE"): Promise<Stock[]> {
        const url = new URL('/api/stocks', window.location.origin);

        if (countryCode) {
            url.searchParams.set('country', countryCode);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch available stocks');
        }
        return await response.json();
    }

    async getCandles(symbol: string, resolution: "1D" | "1M" | "3M" | "1Y"): Promise<CandleResponse> {
        const to = new Date();
        const from = new Date();

        switch (resolution) {
            case '1D':
                from.setDate(to.getDate() - 1);
                break;
            case '1M':
                from.setMonth(to.getMonth() - 1);
                break;
            case '3M':
                from.setMonth(to.getMonth() - 3);
                break;
            case '1Y':
                from.setFullYear(to.getFullYear() - 1);
                break;
        }

        const toTimestamp = Math.floor(to.getTime() / 1000);
        const fromTimestamp = Math.floor(from.getTime() / 1000);

        const params = new URLSearchParams({
            resolution,
            from: fromTimestamp.toString(),
            to: toTimestamp.toString(),
        });

        const response = await fetch(`/api/emulate/${symbol}/history?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch candles for ${symbol}`);
        }

        const history: BackendHistory[] = await response.json();

        return {
            s: 'ok',
            t: history.map(p => p.timestamp),
            c: history.map(p => p.close),
            o: history.map(p => p.open),
            h: history.map(p => p.high),
            l: history.map(p => p.low),
            v: history.map(p => p.volume),
        };
    }

    // Maintain previous prices to compute diffs across invocations.
    private previousPrices: Map<string, number> = new Map();

    async getStockPrice(symbol: string | string[]): Promise<StockPriceResponse> {
        const symbols = Array.isArray(symbol) ? symbol : [symbol];

        const responses = await Promise.all(symbols.map(async (s) => {
            const response = await fetch(`/api/emulate/${s}/price`);
            if (!response.ok) {
                return { symbol: s, mid: null, diff: null, error: true };
            }
            const backendInfo: BackendPriceInfo = await response.json();

            const prev = this.previousPrices.get(s) ?? backendInfo.mid;
            const diff = backendInfo.mid - prev;
            this.previousPrices.set(s, backendInfo.mid);

            return { symbol: s, mid: backendInfo.mid, diff, error: false };
        }));

        const successful = responses.filter(r => !r.error);

        return {
            symbol: successful.map(r => r.symbol),
            mid: successful.map(r => r.mid as number),
            diff: successful.map(r => r.diff as number),
            updated: successful.map(() => new Date().toISOString()),
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

    async getCountryCode(): Promise<string> {
        const response = await fetch('/api/country');
        if (!response.ok) {
            throw new Error('Failed to fetch country code');
        }
        return await response.json();
    }

    async searchStocks(query: string): Promise<Stock[]> {
        if (!query) {
            return [];
        }
        const response = await fetch(`/api/emulate/search?q=${query}`);
        if (!response.ok) {
            throw new Error('Failed to search for stocks');
        }
        return await response.json();
    }
}

export const stockService = new StockService(); 
