import User from '~icons/solar/user-bold'
import { authService } from '../services/authService'
import { router } from '../main'

export const UserDropdown = () => {
    const el = document.createElement('div');
    el.className = 'dropdown';
    el.innerHTML = `
        <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle icon-link" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            ${User}
            <strong>Noël Sigmunczyk</strong>
        </a>
        <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser1">
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="/profile">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="sign-out-link">Sign out</a></li>
        </ul>
    `;

    const signOutLink = el.querySelector('#sign-out-link');
    if (signOutLink) {
        signOutLink.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
            router.navigate('/login');
        });
    }

    return el;
}; 