import "./scss/styles.scss";
import { Router } from './router.ts';

const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
    throw new Error('App root element not found');
}

const homeView = () => {
    const el = document.createElement('div');
    el.innerHTML = '<h1>Home Page</h1><p>Welcome to the home page!</p>';
    return el;
}

const aboutView = () => {
    const el = document.createElement('div');
    el.innerHTML = '<h1>About Page</h1><p>This is the about page.</p>';
    return el;
}

const router = new Router(appElement);

router
    .addRoute('/', homeView)
    .addRoute('/about', aboutView)
    .start();
