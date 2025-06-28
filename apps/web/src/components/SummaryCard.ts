interface SummaryCardProps {
    title: string;
    value: string;
    change?: string;
    changeDirection?: 'up' | 'down';
    footerText?: string;
}

export const SummaryCard = (props: SummaryCardProps) => {
    const { title, value, change, changeDirection, footerText } = props;
    const el = document.createElement('div');
    el.className = 'col-md-4';

    let changeHtml = '';
    if (change && changeDirection) {
        const icon = changeDirection === 'up' ? 'bi-arrow-up' : 'bi-arrow-down';
        const textColor = changeDirection === 'up' ? 'text-success' : 'text-danger';
        changeHtml = `<p class="card-text ${textColor}"><i class="bi ${icon}"></i> ${change}</p>`;
    } else if (footerText) {
        changeHtml = `<p class="card-text text-muted">${footerText}</p>`;
    }

    el.innerHTML = `
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text h2">${value}</p>
                ${changeHtml}
            </div>
        </div>
    `;
    return el;
}; 