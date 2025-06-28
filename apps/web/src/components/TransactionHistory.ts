import { stockService} from "../services/stockService";
import type { Trade } from "../services/stockService";

const renderTransactionRow = (tx: Trade) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date().toLocaleTimeString()}</td>
        <td>${tx.symbol}</td>
        <td>${tx.action}</td>
        <td>${tx.quantity}</td>
    `;
    return row;
};

export const TransactionHistory = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <h5 class="card-title">Transaction History</h5>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Symbol</th>
                    <th>Action</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `;

    const tbody = el.querySelector('tbody');

    const addTransaction = (tx: Trade) => {
        tbody?.prepend(renderTransactionRow(tx));
    };

    stockService.getTransactions().then(transactions => {
        transactions.reverse().forEach(addTransaction);
    }).catch(error => {
        console.error("Failed to load transaction history", error);
        tbody?.prepend('<tr><td colspan="4" class="text-danger">Could not load history.</td></tr>');
    });

    return { element: el, addTransaction };
}; 