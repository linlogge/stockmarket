import { authService } from "../services/authService";
import { router } from "../main";

export const LoginForm = () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <div class="card shadow-sm p-4">
            <div class="card-body">
                <h4 class="card-title mb-4">Welcome back!</h4>
                <div class="alert alert-danger d-none" id="login-error">Invalid credentials</div>
                <form id="login-form">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" value="test@example.com" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" value="password123" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    `;

    const form = el.querySelector('#login-form');
    const errorAlert = el.querySelector('#login-error');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (el.querySelector('#email') as HTMLInputElement).value;
        const password = (el.querySelector('#password') as HTMLInputElement).value;

        try {
            await authService.login(email, password);
            router.navigate('/dashboard');
        } catch (error) {
            errorAlert?.classList.remove('d-none');
        }
    });

    return el;
}; 