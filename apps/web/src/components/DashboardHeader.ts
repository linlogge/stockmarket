import { UserDropdown } from "./UserDropdown";
import Bell from '~icons/solar/bell-bing-bold'
import Magnifier from '~icons/solar/magnifer-linear'

export const DashboardHeader = () => {
    const topHeaderEl = document.createElement('div');
    topHeaderEl.className = 'd-flex justify-content-between align-items-center mb-4';
    topHeaderEl.innerHTML = `
        <div class="input-group" style="width: 300px;">
            <span class="input-group-text bg-white border-0" id="search-addon">${Magnifier}</span>
            <input type="text" class="form-control border-0 bg-white" placeholder='Search for stocks...' aria-label="Search" aria-describedby="search-addon">
        </div>
    `;
    const rightHeaderEl = document.createElement('div');
    rightHeaderEl.className = 'd-flex align-items-center';
    rightHeaderEl.innerHTML = `
        <div class="position-relative me-3">
            ${Bell}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
                <span class="visually-hidden">unread messages</span>
            </span>
        </div>
        <div class="vr mx-3"></div>
    `;
    rightHeaderEl.appendChild(UserDropdown());
    topHeaderEl.appendChild(rightHeaderEl);
    return topHeaderEl;
}; 