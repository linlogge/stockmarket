const TOKEN_KEY = 'stockmarket_token';

class AuthService {
    login(email: string, password: string): Promise<void> {
        return fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            this.setToken(data.token);
            document.body.dispatchEvent(new Event('auth-change'));
        });
    }

    logout(): void {
        this.clearToken();
        fetch('/api/logout', { method: 'POST' });
        document.body.dispatchEvent(new Event('auth-change'));
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token;
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private clearToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export const authService = new AuthService(); 