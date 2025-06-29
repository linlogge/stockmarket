import 'package:flutter/material.dart';

class TradeView extends StatelessWidget {
  const TradeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trade'),
      ),
      body: const Center(
        child: Text('Trade View'),
      ),
    );
  }
} 