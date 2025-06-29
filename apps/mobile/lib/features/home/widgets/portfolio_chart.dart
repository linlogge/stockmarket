import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stockmarket/core/services/api_service.dart';

class PortfolioChart extends ConsumerWidget {
  const PortfolioChart({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(portfolioHistoryProvider);

    return historyAsync.when(
      data: (history) {
        return AspectRatio(
          aspectRatio: 1.7,
          child: Card(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            color: Theme.of(context).colorScheme.primary.withOpacity(0.05),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: false),
                  titlesData: const FlTitlesData(show: false),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: history.data
                          .asMap()
                          .entries
                          .map((e) => FlSpot(e.key.toDouble(), e.value))
                          .toList(),
                      isCurved: true,
                      color: Theme.of(context).colorScheme.primary,
                      barWidth: 3,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          colors: [
                            Theme.of(context).colorScheme.primary.withOpacity(0.3),
                            Theme.of(context).colorScheme.primary.withOpacity(0.0),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
      loading: () => const AspectRatio(
        aspectRatio: 1.7,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (err, stack) => AspectRatio(
        aspectRatio: 1.7,
        child: Center(child: Text('Error loading chart: $err')),
      ),
    );
  }
} 