import { LoginForm } from '../components/LoginForm';
import { Logo } from '../components/Logo';
import Arrow from '~icons/solar/arrow-left-bold'

export const loginView = () => {
    const el = document.createElement('div');
    el.style.height = '100vh';
    el.className = 'd-flex flex-column justify-content-center align-items-center flex-grow-1';

    const formContainer = document.createElement('div');
    formContainer.className = 'col-md-4';
    
    const logoContainer = document.createElement('div');
    logoContainer.className = 'd-flex justify-content-center mb-4';

    const logoContainerEl = document.createElement('div');
    logoContainerEl.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-2', 'flex-column');

    const backToHome = document.createElement('a');
    backToHome.href = '/';
    backToHome.innerHTML = `${Arrow} Back to home`;
    backToHome.dataset.link = 'true';
    backToHome.classList.add('btn', 'icon-link', 'text-decoration-none', 'text-muted', 'text-center', 'text-sm');

    logoContainerEl.appendChild(backToHome);
    logoContainerEl.appendChild(Logo());
    logoContainer.appendChild(logoContainerEl);

    formContainer.appendChild(logoContainer);

    formContainer.appendChild(LoginForm());

    el.appendChild(formContainer);

    return { element: el, cleanup: undefined };
}; 