export const settingsView = () => {
    const el = document.createElement('div');
    el.className = 'container mt-4';
    el.innerHTML = `
        <h1 class="h2 pt-3 pb-2 mb-3">Settings</h1>
        <p>Definetly not worth it to implement.</p>
    `;
    return { element: el, cleanup: undefined };
}; 