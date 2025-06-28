export const DashboardHeader = () => {
    const el = document.createElement('div');
    el.className = 'd-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom';
    el.innerHTML = `
        <h1 class="h2">Dashboard</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
                <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
            </div>
            <div class="dropdown">
                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-calendar3"></i>
                    This week
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Today</a></li>
                    <li><a class="dropdown-item" href="#">This week</a></li>
                    <li><a class="dropdown-item" href="#">This month</a></li>
                    <li><a class="dropdown-item" href="#">This quarter</a></li>
                    <li><a class="dropdown-item" href="#">This year</a></li>
                </ul>
            </div>
        </div>
    `;
    return el;
}; 