import { stockService, type Trade } from "../services/stockService";

interface TradeFormProps {
    onTradeSuccess: (trade: Trade) => void;
}

export const TradeForm = (props: TradeFormProps) => {
    const el = document.createElement('div');
    el.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Trade</h5>
                <div id="trade-alert-container"></div>
                <form id="trade-form">
                    <div class="mb-3">
                        <label for="symbol" class="form-label">Symbol</label>
                        <input class="form-control" list="symbol-options" id="symbol" placeholder="Type to search..." required>
                        <datalist id="symbol-options"></datalist>
                        <div id="price-display" class="form-text mt-2"></div>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Quantity</label>
                        <input type="number" class="form-control" id="quantity" placeholder="0" required min="1">
                    </div>
                    <div class="mb-3">
                        <label for="action" class="form-label">Action</label>
                        <select id="action" class="form-select">
                            <option selected>Buy</option>
                            <option>Sell</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Trade</button>
                </form>
            </div>
        </div>
    `;

    const symbolInput = el.querySelector('#symbol') as HTMLInputElement;
    const symbolDatalist = el.querySelector('#symbol-options');
    const priceDisplay = el.querySelector('#price-display');

    if (symbolDatalist) {
        stockService.getAvailableStocks().then(stocks => {
            stocks.forEach(stock => {
                const option = document.createElement('option');
                option.value = `${stock.symbol} - ${stock.company}`;
                symbolDatalist.appendChild(option);
            });
        }).catch(error => {
            console.error("Failed to load stocks for trading form", error);
            showAlert('Failed to load stock list.', 'danger');
        });
    }

    symbolInput?.addEventListener('input', async () => {
        const datalistOptions = el.querySelectorAll('#symbol-options option');
        const validSymbols = Array.from(datalistOptions).map(opt => (opt as HTMLOptionElement).value);
        const currentValue = symbolInput.value;

        if (priceDisplay && validSymbols.includes(currentValue)) {
            const symbol = currentValue.split(' - ')[0];
            try {
                priceDisplay.textContent = 'Fetching price...';
                const stockPrice = await stockService.getStockPrice(symbol);
                priceDisplay.textContent = `Current Price: ${stockPrice.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`;
            } catch (error) {
                console.error(error);
                priceDisplay.textContent = 'Could not fetch price.';
            }
        } else if (priceDisplay) {
            priceDisplay.textContent = '';
        }
    });

    const showAlert = (message: string, type: 'success' | 'danger') => {
        const alertContainer = el.querySelector('#trade-alert-container');
        if (alertContainer) {
            const alert = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            alertContainer.innerHTML = alert;
        }
    };

    el.querySelector('#trade-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const symbolInput = el.querySelector('#symbol') as HTMLInputElement;
        const quantityInput = el.querySelector('#quantity') as HTMLInputElement;
        const actionInput = el.querySelector('#action') as HTMLSelectElement;

        // Extract symbol from "SYMBOL - Company Name"
        const symbol = symbolInput.value.split(' - ')[0];

        if (!symbol) {
            showAlert('Please select a valid stock.', 'danger');
            return;
        }

        try {
            const trade = {
                symbol: symbol,
                quantity: parseInt(quantityInput.value, 10),
                action: actionInput.value
            };
            const response = await stockService.submitTrade(trade);
            showAlert(response.message, 'success');
            (el.querySelector('#trade-form') as HTMLFormElement).reset();
            if(priceDisplay) priceDisplay.textContent = '';
            props.onTradeSuccess(trade);
        } catch (error) {
            showAlert('Trade failed!', 'danger');
            console.error(error);
        }
    });

    return el;
}; 