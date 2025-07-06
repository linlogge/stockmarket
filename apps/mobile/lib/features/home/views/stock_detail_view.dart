import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:stockmarket/core/services/api_service.dart';
import 'package:stockmarket/models/candle.dart';
import 'package:stockmarket/models/stock.dart';

final selectedResolutionProvider = StateProvider<String>((ref) => '1D');

final candlesProvider =
    FutureProvider.autoDispose.family<List<Candle>, String>((ref, symbol) {
  final apiService = ref.watch(apiServiceProvider);
  final resolution = ref.watch(selectedResolutionProvider);
  return apiService.getCandles(symbol, resolution);
});

class StockDetailView extends ConsumerWidget {
  final Stock stock;
  const StockDetailView({super.key, required this.stock});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final candles = ref.watch(candlesProvider(stock.symbol));
    final resolutions = ['1D', '1M', '3M', '1Y'];

    return Scaffold(
      appBar: AppBar(
        title: Text(stock.company),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: SegmentedButton<String>(
              segments: resolutions
                  .map((r) => ButtonSegment<String>(
                        value: r,
                        label: Text(r),
                      ))
                  .toList(),
              selected: {ref.watch(selectedResolutionProvider)},
              onSelectionChanged: (newSelection) {
                ref.read(selectedResolutionProvider.notifier).state =
                    newSelection.first;
              },
            ),
          ),
          Expanded(
            child: candles.when(
              data: (data) {
                if (data.isEmpty) {
                  return const Center(child: Text('No data available.'));
                }
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: LineChart(
                    LineChartData(
                      lineBarsData: [
                        LineChartBarData(
                          spots: data.map((candle) {
                            return FlSpot(
                              candle.timestamp.toDouble(),
                              candle.close,
                            );
                          }).toList(),
                          isCurved: true,
                          color: Theme.of(context).primaryColor,
                          barWidth: 2,
                          dotData: const FlDotData(show: false),
                          belowBarData: BarAreaData(
                            show: true,
                            color: Theme.of(context)
                                .primaryColor
                                .withOpacity(0.2),
                          ),
                        )
                      ],
                      titlesData: FlTitlesData(
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 30,
                            getTitlesWidget: (value, meta) {
                              final resolution = ref.read(selectedResolutionProvider);
                              final dateTime = DateTime.fromMillisecondsSinceEpoch(value.toInt() * 1000);
                              String text = '';
                              if (resolution == '1D') {
                                text = DateFormat.Hm().format(dateTime);
                              } else if (resolution == '1M') {
                                text = DateFormat.d().format(dateTime);
                              } else if (resolution == '3M') {
                                text = DateFormat.MMM().format(dateTime);
                              } else if (resolution == '1Y') {
                                text = DateFormat.y().format(dateTime);
                              }
                              return SideTitleWidget(
                                axisSide: meta.axisSide,
                                space: 4,
                                child: Text(text),
                              );
                            },
                          ),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (value, meta) =>
                                Text(NumberFormat.compact().format(value)),
                            reservedSize: 40,
                          ),
                        ),
                        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      ),
                      gridData: const FlGridData(show: false),
                      borderData: FlBorderData(show: false),
                    ),
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) =>
                  Center(child: Text('Error loading chart: $err')),
            ),
          ),
        ],
      ),
    );
  }
} 