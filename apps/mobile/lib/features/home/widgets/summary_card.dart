import 'package:flutter/material.dart';

class SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final String? subtitle;
  final bool isPositive;

  const SummaryCard({
    super.key,
    required this.title,
    required this.value,
    this.subtitle,
    this.isPositive = true,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(value, style: Theme.of(context).textTheme.headlineSmall),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: isPositive ? Colors.green : Colors.red,
                    ),
              ),
            ],
          ],
        ),
      ),
    );
  }
} 