import { LoginForm } from '../components/LoginForm';

export const loginView = () => {
    const el = document.createElement('div');
    el.className = 'd-flex justify-content-center align-items-center vh-100';

    const formContainer = document.createElement('div');
    formContainer.className = 'col-md-4';
    formContainer.appendChild(LoginForm());

    el.appendChild(formContainer);

    return { element: el, cleanup: undefined };
}; 