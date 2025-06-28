import { authService } from "./services/authService";

interface Route {
  path: string;
  view: () => View;
  isProtected: boolean;
}

interface View {
    element: HTMLElement;
    cleanup?: () => void;
}

export class Router {
  private routes: Route[] = [];
  private rootElement: HTMLElement;
  private currentViewCleanup?: () => void;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  addRoute(path: string, view: Route['view'], isProtected: boolean = false) {
    this.routes.push({ path, view, isProtected });
    return this;
  }

  navigate(path: string) {
    if (window.location.pathname !== path) {
        history.pushState(null, '', path);
        this.handleRouteChange();
    }
  }

  private handleRouteChange() {
    if (this.currentViewCleanup) {
        this.currentViewCleanup();
    }

    const path = window.location.pathname;
    const matchedRoute = this.matchRoute(path);

    if (matchedRoute) {
        if (matchedRoute.isProtected && !authService.isLoggedIn()) {
            this.navigate('/login');
            return;
        }

      const { element, cleanup } = matchedRoute.view();
      this.rootElement.innerHTML = '';
      this.rootElement.appendChild(element);
      this.currentViewCleanup = cleanup;
    } else {
        this.rootElement.innerHTML = '<h1>404 - Not Found</h1>';
        this.currentViewCleanup = undefined;
    }
  }

  private matchRoute(path: string): Route | undefined {
    return this.routes.find(route => route.path === path);
  }

  private handlePopState() {
    this.handleRouteChange();
  }

  start() {
      this.handleRouteChange();
      this.addLinkListeners();
  }

  private addLinkListeners() {
    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('a[data-link]')) {
            e.preventDefault();
            const href = target.getAttribute('href');
            if(href) {
                this.navigate(href);
            }
        }
    });
  }
}
