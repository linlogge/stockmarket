import { Sidebar } from '../components/Sidebar';
import { PortfolioChart } from '../components/PortfolioChart';
import { siMeta, siApple, siGoogle, siMsi } from 'simple-icons';
import './dashboard-new.scss';

const MyPortfolioSection = () => {
    const el = document.createElement('div');
    el.className = 'my-portfolio-section mb-4';
    el.innerHTML = `
        <h3 class="mb-3">My Portfolio</h3>
        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        ${siApple.svg}
                        <h6 class="card-title text-center">Apple</h6>
                        <p class="card-text text-muted">Total Shares</p>
                        <p class="card-text fw-bold">$310,40</p>
                        <p class="card-text text-danger"><i class="bi bi-arrow-down"></i> 1,10%</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        ${siMeta.svg}
                        <h6 class="card-title text-center">Meta</h6>
                        <p class="card-text text-muted">Total Shares</p>
                        <p class="card-text fw-bold">$140,45</p>
                        <p class="card-text text-danger"><i class="bi bi-arrow-down"></i> 0,10%</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        ${siMsi.svg}
                        <h6 class="card-title text-center">Microsoft</h6>
                        <p class="card-text text-muted">Total Shares</p>
                        <p class="card-text fw-bold">$240,98</p>
                        <p class="card-text text-success"><i class="bi bi-arrow-up"></i> 0,85%</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        ${siGoogle.svg}
                        <h6 class="card-title text-center">Google</h6>
                        <p class="card-text text-muted">Total Shares</p>
                        <p class="card-text fw-bold">$99,12</p>
                        <p class="card-text text-danger"><i class="bi bi-arrow-down"></i> 0,04%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    return el;
};

const MyWatchlistSection = () => {
    const el = document.createElement('div');
    el.className = 'my-watchlist-section card shadow-sm p-4';
    el.innerHTML = `
        <h5 class="mb-3">My watchlist <i class="bi bi-plus-circle"></i></h5>
        <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/spotify-logo.svg" alt="Spotify Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">SPOT</p>
                        <small class="text-muted">Spotify</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$310,40</p>
                    <small class="text-danger"><i class="bi bi-arrow-down"></i> 1,10%</small>
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/airbnb-logo.svg" alt="Airbnb Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">ABNB</p>
                        <small class="text-muted">Airbnb</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$132,72</p>
                    <small class="text-danger"><i class="bi bi-arrow-down"></i> 10,29%</small>
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/shopify-logo.svg" alt="Shopify Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">SHOP</p>
                        <small class="text-muted">Shopify</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$28,57</p>
                    <small class="text-danger"><i class="bi bi-arrow-down"></i> 6,48%</small>
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/sony-logo.svg" alt="Sony Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">SONY</p>
                        <small class="text-muted">Playstation</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$71,86</p>
                    <small class="text-success"><i class="bi bi-arrow-up"></i> 0,98%</small>
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/dropbox-logo.svg" alt="Dropbox Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">DBX</p>
                        <small class="text-muted">Dropbox Inc</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$20,44</p>
                    <small class="text-danger"><i class="bi bi-arrow-down"></i> 3,08%</small>
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="/public/paypal-logo.svg" alt="Paypal Logo" width="30" height="30" class="me-2">
                    <div>
                        <p class="mb-0 fw-bold">PYPL</p>
                        <small class="text-muted">Paypal</small>
                    </div>
                </div>
                <div>
                    <p class="mb-0 fw-bold">$87,66</p>
                    <small class="text-danger"><i class="bi bi-arrow-down"></i> 3,86%</small>
                </div>
            </li>
        </ul>
    `;
    return el;
};

export const dashboardNewView = () => {
    const el = document.createElement('div');
    el.className = 'd-flex'; 

    const navbarEl = document.createElement('div');
    navbarEl.innerHTML = Sidebar(); 
    el.appendChild(navbarEl);

    const mainContentEl = document.createElement('div');
    mainContentEl.className = 'flex-grow-1 p-4'; 

    const topHeaderEl = document.createElement('div');
    topHeaderEl.className = 'd-flex justify-content-between align-items-center mb-4';
    topHeaderEl.innerHTML = `
        <div class="input-group" style="width: 300px;">
            <span class="input-group-text bg-white border-0" id="search-addon"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0" placeholder='Pres "⌘" to search for various stocks' aria-label="Search" aria-describedby="search-addon">
        </div>
        <div class="d-flex align-items-center">
            <i class="bi bi-envelope-fill me-3 fs-5"></i>
            <div class="position-relative me-3">
                <i class="bi bi-bell-fill fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                    <span class="visually-hidden">unread messages</span>
                </span>
            </div>
            <div class="vr mx-3"></div>
            <img src="https://via.placeholder.com/30" alt="User Avatar" class="rounded-circle me-2">
            <span class="me-2">Airlangga Mahesa</span>
            <i class="bi bi-chevron-down"></i>
        </div>
    `;
    mainContentEl.appendChild(topHeaderEl);

    mainContentEl.appendChild(MyPortfolioSection());

    const bottomRowEl = document.createElement('div');
    bottomRowEl.className = 'row g-4';

    const appleChartCol = document.createElement('div');
    appleChartCol.className = 'col-md-8';
    appleChartCol.innerHTML = `
        <div class="card shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Apple inc <small class="text-muted">AAPL</small></h5>
                <div>
                    <span class="badge bg-danger me-2">-1,10%</span>
                    <span class="fw-bold">$150,70</span>
                    <small class="text-muted ms-2">Last update at 14.30</small>
                </div>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <div class="btn-group" role="group" aria-label="Chart time range">
                    <button type="button" class="btn btn-outline-secondary btn-sm">1 Day</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm active">1 Week</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">1 Month</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">3 Month</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">6 Month</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">1 Year</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">5 Year</button>
                </div>
                <button type="button" class="btn btn-outline-secondary btn-sm"><i class="bi bi-grid"></i> All</button>
            </div>
            ${PortfolioChart().outerHTML}
        </div>
    `;
    bottomRowEl.appendChild(appleChartCol);

    const myWatchlistCol = document.createElement('div');
    myWatchlistCol.className = 'col-md-4';
    myWatchlistCol.appendChild(MyWatchlistSection());
    bottomRowEl.appendChild(myWatchlistCol);

    mainContentEl.appendChild(bottomRowEl);

    el.appendChild(mainContentEl);

    const cleanup = () => {
    };

    return { element: el, cleanup };
};