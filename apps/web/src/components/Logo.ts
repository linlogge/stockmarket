import LogoIcon from '~icons/solar/chart-square-bold'

export const Logo = (): HTMLElement => {
    const el = document.createElement('div');
    el.className = 'd-flex align-items-center';
    el.innerHTML = `
        ${LogoIcon}
        <span class="fs-4 ms-2 fw-bold">StockImArsch</span>
    `;
    return el;
};
