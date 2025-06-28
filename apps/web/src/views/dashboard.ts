import { DashboardHeader } from '../components/DashboardHeader';
import { PortfolioChart } from '../components/PortfolioChart';
import { PositionsTable } from '../components/PositionsTable';
import { SummaryCard } from '../components/SummaryCard';

export const dashboardView = () => {
    const el = document.createElement('div');

    el.appendChild(DashboardHeader());

    const summaryRow = document.createElement('div');
    summaryRow.className = 'row';
    summaryRow.appendChild(SummaryCard({
        title: 'Portfolio Value',
        value: '$125,364.21',
        change: '$1,203.45 (1.8%)',
        changeDirection: 'up'
    }));
    summaryRow.appendChild(SummaryCard({
        title: "Day's Gain/Loss",
        value: '-$543.87',
        change: '-0.43%',
        changeDirection: 'down'
    }));
    summaryRow.appendChild(SummaryCard({
        title: 'Account Cash',
        value: '$15,832.10',
        footerText: 'Ready to invest'
    }));
    el.appendChild(summaryRow);
    el.appendChild(PortfolioChart());
    el.appendChild(PositionsTable());


    return el;
}; 