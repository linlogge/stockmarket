export const dashboardView = () => {
    const el = document.createElement('div');

    el.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <i class="fas fa-calendar"></i>
                    This week
                </button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Portfolio Value</h5>
                        <p class="card-text h2">$125,364.21</p>
                        <p class="card-text text-success">
                            <i class="fas fa-arrow-up"></i> $1,203.45 (1.8%)
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Day's Gain/Loss</h5>
                        <p class="card-text h2 text-danger">-$543.87</p>
                        <p class="card-text text-danger">
                            <i class="fas fa-arrow-down"></i> -0.43%
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Account Cash</h5>
                        <p class="card-text h2">$15,832.10</p>
                         <p class="card-text text-muted">
                            Ready to invest
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <h2>Your Positions</h2>
        <div class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Change</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>AAPL</td>
                        <td>Apple Inc.</td>
                        <td>100</td>
                        <td>$175.20</td>
                        <td class="text-success">+$2.30 (1.33%)</td>
                        <td>$17,520.00</td>
                    </tr>
                    <tr>
                        <td>GOOGL</td>
                        <td>Alphabet Inc.</td>
                        <td>50</td>
                        <td>$135.60</td>
                        <td class="text-danger">-$1.12 (0.82%)</td>
                        <td>$6,780.00</td>
                    </tr>
                    <tr>
                        <td>MSFT</td>
                        <td>Microsoft Corp.</td>
                        <td>75</td>
                        <td>$425.80</td>
                        <td class="text-success">+$5.60 (1.33%)</td>
                        <td>$31,935.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    return el;
}; 