import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:stockmarket/core/services/api_service.dart';
import 'package:stockmarket/models/price_info.dart';
import 'package:stockmarket/models/stock.dart';
import 'package:stockmarket/features/home/widgets/portfolio_chart.dart';
import 'package:stockmarket/features/home/widgets/summary_card.dart';
import 'package:stockmarket/features/home/views/stock_detail_view.dart';

final availableStocksProvider = FutureProvider<List<Stock>>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getAvailableStocks();
});

final stockPriceProvider = StreamProvider.family<PriceInfo, String>((ref, symbol) {
  final apiService = ref.watch(apiServiceProvider);
  return Stream.periodic(const Duration(seconds: 1))
      .asyncMap((_) => apiService.getStockPrice(symbol));
});

final searchQueryProvider = StateProvider<String>((ref) => '');

final searchResultsProvider = FutureProvider<List<Stock>>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  final query = ref.watch(searchQueryProvider);
  if (query.isEmpty) {
    return ref.watch(availableStocksProvider.future);
  }
  return apiService.searchStocks(query);
});

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final searchResults = ref.watch(searchResultsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Stocks'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (value) {
                ref.read(searchQueryProvider.notifier).state = value;
              },
              decoration: const InputDecoration(
                hintText: 'Search for stocks...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
            ),
          ),
          Expanded(
            child: searchResults.when(
              data: (stocks) => ListView.builder(
                itemCount: stocks.length,
                itemBuilder: (context, index) {
                  final stock = stocks[index];
                  return StockCard(stock: stock);
                },
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Error: $err')),
            ),
          ),
        ],
      ),
    );
  }
}

class StockCard extends ConsumerWidget {
  final Stock stock;
  const StockCard({super.key, required this.stock});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final priceInfo = ref.watch(stockPriceProvider(stock.symbol));
    final currencyFormat =
        NumberFormat.currency(locale: 'de_DE', symbol: '€');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => StockDetailView(stock: stock),
            ),
          );
        },
        title: Text(stock.symbol),
        subtitle: Text(stock.company),
        trailing: priceInfo.when(
          data: (price) => Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(currencyFormat.format(price.price)),
              Text(
                '${price.diff >= 0 ? '+' : ''}${currencyFormat.format(price.diff)}',
                style: TextStyle(
                  color: price.diff >= 0 ? Colors.green : Colors.red,
                ),
              ),
            ],
          ),
          loading: () => const CircularProgressIndicator(),
          error: (err, stack) => const Icon(Icons.error_outline),
        ),
      ),
    );
  }
} 