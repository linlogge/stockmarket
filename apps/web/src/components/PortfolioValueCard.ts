export const PortfolioValueCard = () => {
    const el = document.createElement('div');
    el.className = 'p-3 mb-3 bg-dark text-white rounded-3';
    
    let value = 5380.90;
    let percentChange = 18.10;
    let increasing = true;

    const updateValues = () => {
        const change = (Math.random() - 0.5) * 0.5;
        value = value * (1 + change/100);
        percentChange += change;
        increasing = change > 0;

        el.innerHTML = `
            <div class="d-flex flex-column gap-2">
                <h5 class="mb-0">Portfolio Value</h5>
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">$${value.toFixed(2)}</h4>
                    <span class="badge ${increasing ? 'bg-success' : 'bg-danger'}">
                        ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}% 
                        <i class="bi bi-arrow-${increasing ? 'up' : 'down'}"></i>
                    </span>
                </div>
            </div>
        `;
    };

    const intervalId = setInterval(updateValues, 5000);
    updateValues(); 

    return {
        element: el,
        cleanup: () => clearInterval(intervalId),
    }
};
