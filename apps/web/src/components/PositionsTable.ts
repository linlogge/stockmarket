export const PositionsTable = () => {
    const el = document.createElement('div');
    el.innerHTML = `
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