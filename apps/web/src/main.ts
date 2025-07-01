import 'bootstrap';
import "./scss/styles.scss";

import { Tooltip } from 'bootstrap';

import { Router } from './router.ts';

import { landingView } from "./views/landing.ts";
import { dashboardNewView } from "./views/dashboard-new.ts";
import { tradeView } from './views/trade.ts';
import { loginView } from './views/login.ts';
import { settingsView } from './views/settings.ts';

document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new Tooltip(el));
});

const appElement = document.querySelector<HTMLDivElement>('#app-container');

if (!appElement) {
    throw new Error('App root element not found');
}

export const router = new Router(appElement);

router
    .addRoute('/', landingView)
    .addRoute('/dashboard', dashboardNewView, true)
    .addRoute('/trade', tradeView, true)
    .addRoute('/login', loginView)
    .addRoute('/settings', settingsView, true)
    .start();
