import { Sidebar } from '../components/DashboardSidebar';
import { stockService } from '../services/stockService';
import { StockCard } from '../components/StockCard';
import { siMeta, siApple, siGoogle } from 'simple-icons';
import './dashboard-new.scss';
import { StockChartCard } from '../components/StockChartCard';
import { Watchlist } from '../components/WatchList';
import { DashboardHeader } from '../components/DashboardHeader';

const MyPortfolioSection = () => {
    const el = document.createElement('div');
    el.className = 'my-portfolio-section mb-4';

    const header = document.createElement('h3');
    header.className = 'mb-3';
    header.textContent = 'My Portfolio';
    el.appendChild(header);

    const cardContainer = document.createElement('div');
    cardContainer.className = 'row row-cols-1 row-cols-md-4 g-4';
    cardContainer.innerHTML = `<p>Loading portfolio...</p>`;
    el.appendChild(cardContainer);

    const stockInfoMap: { [key: string]: { icon: string, name: string } } = {
        'AAPL': { icon: siApple.svg, name: 'Apple' },
        'META': { icon: siMeta.svg, name: 'Meta' },
        'GOOGL': { icon: siGoogle.svg, name: 'Google' }
    };
    const stockSymbols = Object.keys(stockInfoMap);

    stockService.getStockPrice(stockSymbols)
        .then(response => {
            cardContainer.innerHTML = '';
            response.symbol.forEach((symbol, index) => {
                const price = response.mid[index];
                const diff = response.diff[index];
                const info = stockInfoMap[symbol];
                if (info) {
                    const card = StockCard({
                        icon: info.icon,
                        name: info.name,
                        price: price,
                        diff: diff,
                    });
                    cardContainer.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Failed to fetch stock prices:', error);
            cardContainer.innerHTML = `<p class="text-danger">Could not load portfolio data.</p>`;
        });

    return el;
};

export const dashboardNewView = () => {
    const el = document.createElement('div');
    el.className = 'd-flex'; 

    const navbarEl = document.createElement('div');
    navbarEl.innerHTML = Sidebar(); 
    el.appendChild(navbarEl);

    const mainContentEl = document.createElement('div');
    mainContentEl.className = 'flex-grow-1 p-4'; 

    mainContentEl.appendChild(DashboardHeader());

    mainContentEl.appendChild(MyPortfolioSection());

    const bottomRowEl = document.createElement('div');
    bottomRowEl.className = 'row g-4';

    const stockChartCol = document.createElement('div');
    stockChartCol.className = 'col-md-8';
    
    stockChartCol.innerHTML = `<p>Loading chart...</p>`;

    stockService.getStockPrice('AAPL').then(priceData => {
        const price = priceData.mid[0];
        const stockChartCard = StockChartCard({
            icon: siApple.svg,
            companyName: 'Apple Inc.',
            symbol: 'AAPL',
            price: price,
            priceDiff: -1.5,
            priceDiffPercent: -1.10
        });
        stockChartCol.innerHTML = '';
        stockChartCol.appendChild(stockChartCard);
    }).catch(error => {
        console.error('Failed to load chart data', error);
        stockChartCol.innerHTML = `<p class="text-danger">Could not load chart.</p>`;
    });
    
    bottomRowEl.appendChild(stockChartCol);

    const myWatchlistCol = document.createElement('div');
    myWatchlistCol.className = 'col-md-4';
    const watchlist = Watchlist();
    myWatchlistCol.appendChild(watchlist.element);
    bottomRowEl.appendChild(myWatchlistCol);

    mainContentEl.appendChild(bottomRowEl);

    el.appendChild(mainContentEl);

    const cleanup = () => {
        watchlist.cleanup();
    };

    return { element: el, cleanup };
};