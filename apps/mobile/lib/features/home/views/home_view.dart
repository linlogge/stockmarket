import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stockmarket/core/providers/api_providers.dart';

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
        data: (summary) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Portfolio Value: €${summary.portfolioValue.toStringAsFixed(2)}',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                "Day's Gain: €${summary.daysGain.toStringAsFixed(2)}",
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: summary.daysGain >= 0 ? Colors.green : Colors.red,
                    ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
} 