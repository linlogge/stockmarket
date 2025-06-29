import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:stockmarket/core/services/api_service.dart';
import 'package:stockmarket/features/home/widgets/portfolio_chart.dart';
import 'package:stockmarket/features/home/widgets/summary_card.dart';

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summary = ref.watch(portfolioSummaryProvider);
    final positions = ref.watch(positionsProvider);

    final currencyFormat =
        NumberFormat.currency(locale: 'de_DE', symbol: '€');
    final percentFormat = NumberFormat.percentPattern('de_DE');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: RefreshIndicator(
        onRefresh: () {
          ref.invalidate(positionsProvider);
          return ref.refresh(portfolioSummaryProvider.future);
        },
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            summary.when(
              data: (summaryData) => Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: SummaryCard(
                          title: 'Portfolio Value',
                          value: currencyFormat.format(summaryData.portfolioValue),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: SummaryCard(
                          title: "Day's Gain",
                          value: currencyFormat.format(summaryData.daysGain),
                          subtitle: percentFormat.format(summaryData.daysGainPercent),
                          isPositive: summaryData.daysGain >= 0,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              loading: () => const Row(
                children: [
                  Expanded(child: SummaryCard(title: 'Portfolio Value', value: '...')),
                  SizedBox(width: 16),
                  Expanded(child: SummaryCard(title: "Day's Gain", value: '...'))
                ],
              ),
              error: (error, stack) => Center(child: Text('Error: $error')),
            ),
            const SizedBox(height: 24),
            const PortfolioChart(),
            const SizedBox(height: 24),
            Text('Your Positions',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            positions.when(
              data: (positions) {
                if (positions.isEmpty) {
                  return const Center(
                      child: Padding(
                    padding: EdgeInsets.all(32.0),
                    child: Text('You have no open positions.'),
                  ));
                }
                return Card(
                  clipBehavior: Clip.antiAlias,
                  child: DataTable(
                    columns: const [
                      DataColumn(label: Text('Symbol')),
                      DataColumn(label: Text('Shares')),
                      DataColumn(label: Text('Price'), numeric: true),
                      DataColumn(label: Text('Value'), numeric: true),
                    ],
                    rows: positions.map((pos) {
                      return DataRow(
                        cells: [
                          DataCell(Text(pos.symbol)),
                          DataCell(Text(pos.shares.toString())),
                          DataCell(Text(currencyFormat.format(pos.price))),
                          DataCell(Text(currencyFormat.format(pos.value))),
                        ],
                      );
                    }).toList(),
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(child: Text('Error: $error')),
            ),
          ],
        ),
      ),
    );
  }
} 