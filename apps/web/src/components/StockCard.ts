interface StockCardProps {
    icon: string;
    name: string;
    price: number;
    diff: number;
}

export const StockCard = ({ icon, name, price, diff }: StockCardProps) => {
    const el = document.createElement('div');
    el.className = 'col';

    const openPrice = price - diff;
    const changePercent = openPrice !== 0 ? ((diff / openPrice) * 100).toFixed(2) : '0.00';
    const isNegative = diff < 0;

    el.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body d-flex flex-row justify-content-between gap-4">
                <div class="d-flex flex-column align-items-start gap-4">
                    <div style="width: 24px; height: 24px;">${icon}</div>
                    <h6 class="card-title m-0 text-nowrap">${name}</h6>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <h4 class="card-text fw-bold">$${price.toFixed(2)}</h4>
                    <span class="badge bg-${isNegative ? 'danger' : 'success'}">
                        <i class="bi bi-arrow-${isNegative ? 'down' : 'up'}"></i> ${changePercent}%
                    </span>
                </div>
            </div>
        </div>
    `;
    return el;
}; 