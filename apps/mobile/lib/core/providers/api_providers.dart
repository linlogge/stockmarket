import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stockmarket/core/services/api_service.dart';
import 'package:stockmarket/core/services/auth_service.dart';
import 'package:stockmarket/models/portfolio_history.dart';
import 'package:stockmarket/models/portfolio_summary.dart';
import 'package:stockmarket/models/stock.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  final authService = ref.watch(authServiceProvider);
  return ApiService(authService);
});

final availableStocksProvider = FutureProvider<List<Stock>>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getAvailableStocks();
});

final stockPriceProvider = FutureProvider.family<double, String>((ref, symbol) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getStockPrice(symbol);
});

final portfolioHistoryProvider = FutureProvider<PortfolioHistory>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getPortfolioHistory();
});

final portfolioSummaryProvider = StreamProvider.autoDispose<PortfolioSummary>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  final controller = StreamController<PortfolioSummary>();

  Future<void> fetchSummary() async {
    try {
      final summary = await apiService.getPortfolioSummary();
      if (!controller.isClosed) {
        controller.add(summary);
      }
    } catch (e, s) {
      if (!controller.isClosed) {
        controller.addError(e, s);
      }
    }
  }

  // Fetch immediately and then periodically
  fetchSummary();
  final timer = Timer.periodic(const Duration(seconds: 1), (_) => fetchSummary());

  // Cleanup when the provider is disposed
  ref.onDispose(() {
    timer.cancel();
    controller.close();
  });

  return controller.stream;
}); 