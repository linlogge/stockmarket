export const dashboardView = () => {
    const el = document.createElement('div');

    el.innerHTML = `
        <h1>Dashboard</h1>
        <p>Here is your stock market dashboard.</p>
    `;

    return el;
}; 