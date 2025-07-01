import Grid from '~icons/solar/code-scan-bold'
import { Logo } from "./Logo"
import Trade from '~icons/solar/transfer-horizontal-bold'
import News from '~icons/solar/notebook-bookmark-bold'

export const Sidebar = () => {
  return `
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" style="width: 280px; height: 100vh;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <div class="d-flex align-items-center">
          ${Logo().outerHTML}
        </div>
      </a>
      <hr>
      <div class="p-3 mb-3 bg-dark text-white rounded-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <small class="text-muted">Total Investment</small>
            <h4 class="mb-0">$5380,90</h4>
          </div>
          <span class="badge bg-success">+18,10% <i class="bi bi-arrow-up"></i></span>
        </div>
      </div>
      <ul class="nav nav-pills flex-column mb-auto">
        <li>
          <a href="/dashboard" data-link class="icon-link nav-link active" data-link>
            ${Grid}
            Dashboard
          </a>
        </li>
        <li>
          <a href="/trade" data-link class="icon-link nav-link link-dark">
            ${Trade}
            Trade
          </a>
        </li>
        <li>
          <a href="#" data-link class="nav-link link-dark icon-link">
            ${News}
            News
          </a>
        </li>
      </ul>
    </div>
  `;
};