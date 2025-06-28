import { LoginForm } from '../components/LoginForm';

export const loginView = () => {
    const el = document.createElement('div');
    el.className = 'd-flex flex-column justify-content-center flex-grow-1';

    const formRow = document.createElement('div');
    formRow.className = 'row justify-content-center';

    const formContainer = document.createElement('div');
    formContainer.className = 'col-md-4';
    formContainer.appendChild(LoginForm());

    formRow.appendChild(formContainer);
    el.appendChild(formRow);

    return { element: el, cleanup: undefined };
}; 