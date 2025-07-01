import { authService } from "../services/authService";

export const LoginButton = () => {
    const isLoggedIn = authService.isLoggedIn();

    if (isLoggedIn) {
        const el = document.createElement('a');
        el.className = 'btn btn-primary';
        el.textContent = 'Dashboard';
        el.href = '/dashboard';
        el.dataset.link = 'true';
        return el;
    }

    const el = document.createElement('a');
    el.className = 'btn btn-primary';
    el.textContent = 'Login';
    el.href = '/login';
    el.dataset.link = 'true';

    return el;
};
