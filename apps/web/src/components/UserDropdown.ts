import User from '~icons/solar/user-bold'
import { authService } from '../services/authService'
import { router } from '../main'

export const UserDropdown = () => {
    const el = document.createElement('div');
    el.className = 'dropdown d-none d-lg-block';
    el.innerHTML = `
        <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle icon-link" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            ${User}
            <strong class="d-none d-lg-inline">Ivan Malakhov</strong>
        </a>
        <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser1">
            <li><a class="dropdown-item" href="/settings" data-link>Settings</a></li>
            <li><a class="dropdown-item" href="/profile" data-link>Profile</a></li>
            <li><a class="dropdown-item" href="/pro" data-link>Go Pro</a></li>
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

    const settingsLink = el.querySelector('a[href="/settings"]');
    if(settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate('/settings');
        });
    }

    const profileLink = el.querySelector('a[href="/profile"]');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }

    return el;
}; 