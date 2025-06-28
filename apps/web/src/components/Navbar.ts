import { authService } from "../services/authService";
import { router } from "../main";

const renderNavbar = (container: HTMLElement) => {
    const isLoggedIn = authService.isLoggedIn();

    let authLink;
    if (isLoggedIn) {
        authLink = `
            <li class="nav-item">
                <button id="logout-button" class="btn btn-link nav-link">Logout</button>
            </li>
        `;
    } else {
        authLink = `
            <li class="nav-item">
                <a class="nav-link" href="/login" data-link>Login</a>
            </li>
        `;
    }

    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="/" data-link>StockMarket</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="/dashboard" data-link>Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/trade" data-link>Trade</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        ${authLink}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    if (isLoggedIn) {
        container.querySelector('#logout-button')?.addEventListener('click', () => {
            authService.logout();
            router.navigate('/');
        });
    }
};

export const Navbar = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error('Navbar container not found');
    }

    // Initial render
    renderNavbar(container);

    // Listen for auth changes to re-render
    document.body.addEventListener('auth-change', () => renderNavbar(container));
}; 