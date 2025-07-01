import Grid from '~icons/solar/code-scan-bold'
import { Logo } from "./Logo"
import Trade from '~icons/solar/transfer-horizontal-bold'
import News from '~icons/solar/notebook-bookmark-bold'
import { PortfolioValueCard } from "./PortfolioValueCard"

export const Sidebar = () => {
  const el = document.createElement('div');
  el.className = 'd-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm';
  el.style.width = '280px';
  el.style.height = '100vh';

  const portfolioValueCard = PortfolioValueCard();

  const logo = document.createElement('a');
  logo.href = '/';
  logo.className = 'd-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none';
  logo.appendChild(Logo());
  el.appendChild(logo);

  el.appendChild(document.createElement('hr'));
  el.appendChild(portfolioValueCard.element);

  const nav = document.createElement('ul');
  nav.className = 'nav nav-pills flex-column mb-auto';

  const dashboardLink = document.createElement('a');
  dashboardLink.href = '/dashboard';
  dashboardLink.className = 'icon-link nav-link active';
  dashboardLink.innerHTML = `${Grid} Dashboard`;
  nav.appendChild(dashboardLink);

  el.appendChild(nav);

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

  el.appendChild(nav);

  return {
    element: el,
    cleanup: () => portfolioValueCard.cleanup(),
  };
};
