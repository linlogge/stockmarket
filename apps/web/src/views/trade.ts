import { TradeForm } from '../components/TradeForm';
import { TransactionHistory } from '../components/TransactionHistory';

export const tradeView = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <h1 class="h2 pt-3 pb-2 mb-3">Trade</h1>
        <div class="row">
            <div class="col-md-5">
                <div class="trade-form-container"></div>
            </div>
            <div class="col-md-7">
                <div class="transaction-history-container card card-body"></div>
            </div>
        </div>
    `;

    const formContainer = el.querySelector('.trade-form-container');
    const historyContainer = el.querySelector('.transaction-history-container');

    if (formContainer && historyContainer) {
        const historyComponent = TransactionHistory();
        historyContainer.appendChild(historyComponent.element);

        const formComponent = TradeForm({
            onTradeSuccess: (trade) => {
                historyComponent.addTransaction(trade);
            }
        });
        formContainer.appendChild(formComponent);
    }

    return { element: el, cleanup: undefined };
}; 