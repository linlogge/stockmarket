import "./scss/styles.scss";
import { Router } from './router.ts';
import { landingView } from "./views/landing.ts";
import { dashboardView } from "./views/dashboard.ts";
import 'bootstrap';

import { Tooltip } from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new Tooltip(el));
});


const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
    throw new Error('App root element not found');
}

const router = new Router(appElement);

router
    .addRoute('/', landingView)
    .addRoute('/dashboard', dashboardView)
    .start();
