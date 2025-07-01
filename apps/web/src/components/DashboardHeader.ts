import Menu from '~icons/solar/hamburger-menu-linear';
import { UserDropdown } from "./UserDropdown";
import Bell from '~icons/solar/bell-bing-bold'
import Magnifier from '~icons/solar/magnifer-linear'
import { Logo } from './Logo';

export const DashboardHeader = () => {
    const topHeaderEl = document.createElement('div');
    topHeaderEl.className = 'd-flex justify-content-between align-items-center mb-4 max-width-100';
    topHeaderEl.innerHTML = `
        <div class="input-group d-none d-lg-flex" style="width: 300px;">
            <span class="input-group-text bg-white border-0" id="search-addon">${Magnifier}</span>
            <input type="text" class="form-control border-0 bg-white" placeholder='Search for stocks...' aria-label="Search" aria-describedby="search-addon">
        </div>
    `;
    const logo = Logo();
    logo.className = 'd-flex align-items-center me-3 d-lg-none';
    topHeaderEl.appendChild(logo);
    const rightHeaderEl = document.createElement('div');
    rightHeaderEl.className = 'd-flex align-items-center';
    rightHeaderEl.innerHTML = `
        <div class="position-relative me-3 d-none d-lg-block">
            ${Bell}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
                <span class="visually-hidden">unread messages</span>
            </span>
        </div>
        <div class="vr mx-3 d-none d-lg-block"></div>
    `;
    rightHeaderEl.appendChild(UserDropdown());

    const menuButton = document.createElement('button');
    menuButton.className = 'btn d-lg-none ms-3';
    menuButton.type = 'button';
    menuButton.setAttribute('data-bs-toggle', 'offcanvas');
    menuButton.setAttribute('data-bs-target', '#sidebarMenu');
    menuButton.setAttribute('aria-controls', 'sidebarMenu');
    menuButton.innerHTML = Menu;
    rightHeaderEl.appendChild(menuButton);

    topHeaderEl.appendChild(rightHeaderEl);
    return topHeaderEl;
}; 