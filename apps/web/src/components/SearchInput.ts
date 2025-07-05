import { stockService, type Stock } from "../services/stockService";
import { router } from "../main";
import { ICONS } from "../utils/icons";
import { debounce } from "lodash-es";

export const SearchInput = () => {
    const el = document.createElement('div');
    el.className = 'search-input-container dropdown';

    el.innerHTML = `
        <div class="input-group" style="max-width: 500px;">
            <input type="text" class="form-control bg-white" placeholder="Search for a stock..." aria-label="Search for a stock" data-bs-toggle="dropdown" aria-expanded="false">
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
            </ul>
        </div>
    `;

    const input = el.querySelector<HTMLInputElement>('input');
    const dropdownMenu = el.querySelector<HTMLUListElement>('.dropdown-menu');

    if (!input || !dropdownMenu) {
        throw new Error("Search input elements not found");
    }

    const onStockSelected = (stock: Stock) => {
        router.navigate(`/?symbol=${stock.symbol}`);
        input.value = '';
        dropdownMenu.classList.remove('show');
    };

    const search = async (query: string) => {
        const stocks = await stockService.searchStocks(query);
        dropdownMenu.innerHTML = '';

        if (stocks.length === 0) {
            dropdownMenu.innerHTML = '<li><span class="dropdown-item-text">No stocks found</span></li>';
        } else {
            stocks.forEach(stock => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <a class="dropdown-item d-flex align-items-center" href="#">
                        <div class="me-3" style="width: 24px; height: 24px;">
                            ${ICONS[stock.symbol] || ICONS.DEFAULT}
                        </div>
                        <div class="d-flex flex-grow-1 justify-content-between">
                            <strong>${stock.symbol}</strong>
                            <small class="text-muted">${stock.company}</small>
                        </div>
                    </a>
                `;
                item.addEventListener('click', () => onStockSelected(stock));
                dropdownMenu.appendChild(item);
            });
        }
    };
    
    input.addEventListener('input', debounce(async (e: Event) => {
        const query = (e.target as HTMLInputElement).value;
        if (query.length > 0) {
            await search(query);
        } else {
            dropdownMenu.innerHTML = '';
        }
    }, 300));
    
    return el;
}; 