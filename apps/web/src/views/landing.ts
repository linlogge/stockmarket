export const landingView = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <div class="p-5 mb-4 bg-light rounded-3">
            <div class="container-fluid py-5">
                <h1 class="display-5 fw-bold">Welcome to StockMarket</h1>
                <p class="col-md-8 fs-4">
                    Your one-stop shop for all the latest stock market data.
                </p>
                <a href="/dashboard" class="btn btn-primary btn-lg" data-link>Go to Dashboard</a>
            </div>
        </div>
    `;
    return { element: el, cleanup: undefined };
}; 