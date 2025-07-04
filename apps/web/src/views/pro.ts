export const proView = () => {
    const el = document.createElement('div');
    el.className = 'container mt-4';
    el.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">Go Pro!</h1>
                <p class="card-text">Unlock exclusive features by upgrading to the Pro version of our app.</p>
                <ul class="list-group list-group-flush mb-4">
                    <li class="list-group-item">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Real-time stock data
                    </li>
                    <li class="list-group-item">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Advanced charting tools
                    </li>
                    <li class="list-group-item">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Unlimited portfolio tracking
                    </li>
                    <li class="list-group-item">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Priority support
                    </li>
                </ul>
                <a href="#" class="btn btn-primary btn-lg">Upgrade Now</a>
            </div>
        </div>
    `;
    return {
        element: el,
        cleanup: () => {}
    };
}; 