import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stockmarket/core/providers/api_providers.dart';
import 'package:stockmarket/features/home/widgets/portfolio_line_chart.dart';

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summaryAsync = ref.watch(portfolioSummaryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: summaryAsync.when(
        data: (summary) => SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text(
                      'Portfolio Value',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      '€${summary.portfolioValue.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Day's Gain: €${summary.daysGain.toStringAsFixed(2)} (${(summary.daysGainPercent * 100).toStringAsFixed(2)}%)",
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: summary.daysGain >= 0
                                ? Colors.green
                                : Colors.red,
                          ),
                    ),
                  ],
                ),
              ),
              const PortfolioLineChart(),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
} 