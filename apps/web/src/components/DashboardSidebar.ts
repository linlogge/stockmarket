import Grid from '~icons/solar/code-scan-bold'
import { Logo } from "./Logo"
import Trade from '~icons/solar/transfer-horizontal-bold'
import News from '~icons/solar/notebook-bookmark-bold'
import { PortfolioValueCard } from "./PortfolioValueCard"

export const Sidebar = () => {
  const el = document.createElement('div');
  el.className = 'offcanvas-lg offcanvas-start bg-white shadow-sm';
  el.setAttribute('tabindex', '-1');
  el.id = 'sidebarMenu';
  el.setAttribute('aria-labelledby', 'sidebarMenuLabel');
  el.style.width = '280px';

  const offcanvasHeader = document.createElement('div');
  offcanvasHeader.className = 'offcanvas-header d-lg-none';

  const offcanvasTitle = document.createElement('h5');
  offcanvasTitle.className = 'offcanvas-title';
  offcanvasTitle.id = 'sidebarMenuLabel';
  offcanvasTitle.appendChild(Logo());
  offcanvasHeader.appendChild(offcanvasTitle);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.setAttribute('data-bs-dismiss', 'offcanvas');
  closeButton.setAttribute('data-bs-target', '#sidebarMenu');
  closeButton.setAttribute('aria-label', 'Close');
  offcanvasHeader.appendChild(closeButton);

  el.appendChild(offcanvasHeader);

  const offcanvasBody = document.createElement('div');
  offcanvasBody.className = 'offcanvas-body d-flex flex-column p-3';
  const portfolioValueCard = PortfolioValueCard();

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'd-none d-lg-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none';
  logoLink.appendChild(Logo());
  offcanvasBody.appendChild(logoLink);

  offcanvasBody.appendChild(document.createElement('hr'));
  offcanvasBody.appendChild(portfolioValueCard.element);

  const nav = document.createElement('ul');
  nav.className = 'nav nav-pills flex-column mb-auto';

  const dashboardLink = document.createElement('a');
  dashboardLink.href = '/dashboard';
  dashboardLink.className = 'icon-link nav-link active';
  dashboardLink.innerHTML = `${Grid} Dashboard`;
  nav.appendChild(dashboardLink);

  const tradeLink = document.createElement('a');
  tradeLink.href = '/trade';
  tradeLink.className = 'icon-link nav-link link-dark';
  tradeLink.innerHTML = `${Trade} Trade`;
  nav.appendChild(tradeLink);

  const newsLink = document.createElement('a');
  newsLink.href = '/news';
  newsLink.className = 'nav-link link-dark icon-link';
  newsLink.innerHTML = `${News} News`;
  nav.appendChild(newsLink);

  offcanvasBody.appendChild(nav);
  el.appendChild(offcanvasBody);

  return {
    element: el,
    cleanup: () => portfolioValueCard.cleanup(),
  };
};
