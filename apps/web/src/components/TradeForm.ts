import { stockService } from "../services/stockService";

export const TradeForm = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Trade</h5>
                <div id="trade-alert-container"></div>
                <form id="trade-form">
                    <div class="mb-3">
                        <label for="symbol" class="form-label">Symbol</label>
                        <input type="text" class="form-control" id="symbol" placeholder="e.g., AAPL" required>
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

        try {
            const response = await stockService.submitTrade({
                symbol: symbolInput.value,
                quantity: parseInt(quantityInput.value, 10),
                action: actionInput.value
            });
            showAlert(response.message, 'success');
            (el.querySelector('#trade-form') as HTMLFormElement).reset();
        } catch (error) {
            showAlert('Trade failed!', 'danger');
            console.error(error);
        }
    });

    return el;
}; 