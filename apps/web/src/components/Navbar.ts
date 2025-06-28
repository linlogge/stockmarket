import { authService } from "../services/authService";
import { router } from "../main";

const renderNavbar = (container: HTMLElement) => {
    const isLoggedIn = authService.isLoggedIn();

    let authNav;
    if (isLoggedIn) {
        authNav = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="/settings" data-link>Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button id="logout-button" class="dropdown-item">Logout</button></li>
                </ul>
            </li>
        `;
    } else {
        authNav = `
            <li class="nav-item">
                <a class="nav-link" href="/login" data-link>Login</a>
            </li>
        `;
    }

    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
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
                        ${authNav}
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