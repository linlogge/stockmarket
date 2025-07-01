interface StockCardProps {
    icon: string;
    name: string;
    price: number;
}

export const StockCard = ({ icon, name, price }: StockCardProps) => {
    const el = document.createElement('div');
    el.className = 'col';
    
    const isNegative = Math.random() < 0.5;
    const changePercent = (Math.random() * 2).toFixed(2);

    el.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
                ${icon}
                <h6 class="card-title text-center">${name}</h6>
                <p class="card-text text-muted">Current Price</p>
                <p class="card-text fw-bold">$${price.toFixed(2)}</p>
                <p class="card-text text-${isNegative ? 'danger' : 'success'}">
                    <i class="bi bi-arrow-${isNegative ? 'down' : 'up'}"></i> ${changePercent}%
                </p>
            </div>
        </div>
    `;
    return el;
}; 