import { TradeForm } from '../components/TradeForm';

export const tradeView = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <h1 class="h2 pt-3 pb-2 mb-3">Trade</h1>
        <div class="row">
            <div class="col-md-6 trade-form-container">
            </div>
        </div>
    `;

    const formContainer = el.querySelector('.trade-form-container');
    if(formContainer) {
        formContainer.appendChild(TradeForm());
    }

    return { element: el, cleanup: undefined };
}; 