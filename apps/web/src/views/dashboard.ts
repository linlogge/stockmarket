import { DashboardHeader } from '../components/DashboardHeader';
import { PortfolioChart } from '../components/PortfolioChart';
import { PositionsTable } from '../components/PositionsTable';
import { SummaryCard } from '../components/SummaryCard';
import { stockService } from '../services/stockService';

export const dashboardView = () => {
    const el = document.createElement('div');

    el.appendChild(DashboardHeader());

    const summaryRow = document.createElement('div');
    summaryRow.className = 'row';

    const portfolioCard = SummaryCard({
        title: 'Portfolio Value',
        value: '$0.00'
    });
    const dailyGainCard = SummaryCard({
        title: "Day's Gain/Loss",
        value: '$0.00'
    });
    const cashCard = SummaryCard({
        title: 'Account Cash',
        value: '$15,832.10',
        footerText: 'Ready to invest'
    });

    summaryRow.appendChild(portfolioCard.element);
    summaryRow.appendChild(dailyGainCard.element);
    summaryRow.appendChild(cashCard.element);
    el.appendChild(summaryRow);

    el.appendChild(PortfolioChart());
    el.appendChild(PositionsTable());

    const updateSummary = async () => {
        try {
            const summary = await stockService.getPortfolioSummary();
            portfolioCard.update({ value: `$${summary.portfolio_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` });

            const gain = summary.days_gain;
            const gainPercent = summary.days_gain_percent * 100;
            dailyGainCard.update({
                value: `${gain < 0 ? '-' : ''}$${Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${gainPercent.toFixed(2)}%`,
                changeDirection: gain >= 0 ? 'up' : 'down'
            });
        } catch (error) {
            console.error("Failed to update portfolio summary", error);
        }
    };

    updateSummary();
    const pollingInterval = setInterval(updateSummary, 1000);

    const cleanup = () => {
        clearInterval(pollingInterval);
    };

    return { element: el, cleanup };
}; 