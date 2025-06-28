interface SummaryCardProps {
    title: string;
    value: string;
    change?: string;
    changeDirection?: 'up' | 'down';
    footerText?: string;
}

export const SummaryCard = (props: SummaryCardProps) => {
    const el = document.createElement('div');
    el.className = 'col-md-4';

    const render = (currentProps: SummaryCardProps) => {
        const { title, value, change, changeDirection, footerText } = currentProps;

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
                    <p class="card-text h2 value-display">${value}</p>
                    <div class="change-display">${changeHtml}</div>
                </div>
            </div>
        `;
    };

    const update = (newProps: Partial<SummaryCardProps>) => {
        const updatedProps = { ...props, ...newProps };
        const valueDisplay = el.querySelector('.value-display');
        const changeDisplay = el.querySelector('.change-display');

        if (valueDisplay) valueDisplay.innerHTML = updatedProps.value;
        if (changeDisplay) {
            let changeHtml = '';
            if (updatedProps.change && updatedProps.changeDirection) {
                const icon = updatedProps.changeDirection === 'up' ? 'bi-arrow-up' : 'bi-arrow-down';
                const textColor = updatedProps.changeDirection === 'up' ? 'text-success' : 'text-danger';
                changeHtml = `<p class="card-text ${textColor}"><i class="bi ${icon}"></i> ${updatedProps.change}</p>`;
            } else if (updatedProps.footerText) {
                changeHtml = `<p class="card-text text-muted">${updatedProps.footerText}</p>`;
            }
            changeDisplay.innerHTML = changeHtml;
        }
        props = updatedProps;
    };

    render(props);

    return { element: el, update };
}; 