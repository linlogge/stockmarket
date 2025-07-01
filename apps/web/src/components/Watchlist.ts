import { stockService } from "../services/stockService";
import { ICONS } from "../utils/icons";
import Plus from '~icons/solar/add-circle-bold'

export const Watchlist = () => {
    const el = document.createElement('div');
    el.className = 'my-watchlist-section card shadow-sm p-4';

    const header = document.createElement('h5');
    header.className = 'mb-3 icon-link';
    header.innerHTML = `My watchlist ${Plus}`;
    el.appendChild(header);

    const listContainer = document.createElement('ul');
    listContainer.className = 'list-group list-group-flush';
    listContainer.innerHTML = `<p>Loading watchlist...</p>`;
    el.appendChild(listContainer);

    let intervalId: number;

    const updateWatchlist = async () => {
        try {
            const availableStocks = await stockService.getAvailableStocks();
            const watchlistStocks = availableStocks.slice(0, 5);
            const watchlistSymbols = watchlistStocks.map(s => s.symbol);

            if (watchlistStocks.length > 0) {
                const priceData = await stockService.getStockPrice(watchlistSymbols);

                const priceMap = new Map<string, { price: number, diff: number }>();
                for (let i = 0; i < priceData.symbol.length; i++) {
                    priceMap.set(priceData.symbol[i], {
                        price: priceData.mid[i],
                        diff: priceData.diff[i]
                    });
                }

                listContainer.innerHTML = '';
                watchlistStocks.forEach(stock => {
                    const stockPrice = priceMap.get(stock.symbol);
                    if (stockPrice) {
                        const openPrice = stockPrice.price - stockPrice.diff;
                        const changePercent = openPrice !== 0 ? ((stockPrice.diff / openPrice) * 100).toFixed(2) : '0.00';
                        const isNegative = stockPrice.diff < 0;

                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                        const icon = ICONS[stock.symbol] || ICONS['DEFAULT'];

                        listItem.innerHTML = `
                            <div class="d-flex align-items-center">
                                <div style="width: 30px; height: 30px;" class="me-2">${icon}</div>
                                <div>
                                    <p class="mb-0 fw-bold">${stock.symbol}</p>
                                    <small class="text-muted">${stock.company}</small>
                                </div>
                            </div>
                            <div class="d-flex flex-column align-items-end">
                                <p class="mb-0 fw-bold">$${stockPrice.price.toFixed(2)}</p>
                                <small class="text-${isNegative ? 'danger' : 'success'}">
                                    <i class="bi bi-arrow-${isNegative ? 'down' : 'up'}"></i> ${changePercent}%
                                </small>
                            </div>
                        `;
                        listContainer.appendChild(listItem);
                    }
                });

            } else {
                listContainer.innerHTML = `<p>No stocks available for watchlist.</p>`;
            }
        } catch (error) {
            console.error('Failed to load watchlist:', error);
            if (listContainer.querySelector('li') === null) {
                listContainer.innerHTML = `<p class="text-danger">Could not load watchlist.</p>`;
            }
        }
    };

    updateWatchlist();
    intervalId = window.setInterval(updateWatchlist, 1000);

    const cleanup = () => {
        clearInterval(intervalId);
    };

    return { element: el, cleanup };
};
