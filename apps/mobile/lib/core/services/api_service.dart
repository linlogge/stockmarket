import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:stockmarket/core/constants.dart';
import 'package:stockmarket/core/services/auth_service.dart';
import 'package:stockmarket/models/candle.dart';
import 'package:stockmarket/models/portfolio_history.dart';
import 'package:stockmarket/models/portfolio_summary.dart';
import 'package:stockmarket/models/price_info.dart';
import 'package:stockmarket/models/stock.dart';
import 'package:stockmarket/models/trade.dart';
import 'package:stockmarket/models/position.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  final authService = ref.watch(authServiceProvider);
  return ApiService(authService);
});

class ApiService {
  final AuthService _authService;
  final String _baseUrl = apiBaseUrl;

  ApiService(this._authService);

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<PortfolioSummary> getPortfolioSummary() async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl/portfolio/summary'), headers: headers);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return PortfolioSummary.fromJson(data);
    } else {
      throw Exception('Failed to load portfolio summary');
    }
  }
  
  Future<PortfolioHistory> getPortfolioHistory() async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl/portfolio/history'), headers: headers);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return PortfolioHistory.fromJson(data);
    } else {
      throw Exception('Failed to load portfolio history');
    }
  }

  Future<List<Stock>> getAvailableStocks() async {
    final response = await http.get(Uri.parse('$_baseUrl/emulate?locale=US'));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Stock.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load available stocks');
    }
  }

  final Map<String, double> _previousPrices = {};

  Future<PriceInfo> getStockPrice(String symbol) async {
    final response = await http.get(Uri.parse('$_baseUrl/emulate/$symbol/price'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final price = (data['mid'] as num).toDouble();
      final prevPrice = _previousPrices[symbol] ?? price;
      final diff = price - prevPrice;
      _previousPrices[symbol] = price;
      return PriceInfo(price: price, diff: diff);
    } else {
      throw Exception('Failed to load stock price');
    }
  }

  Future<List<Candle>> getCandles(String symbol, String resolution) async {
    final to = DateTime.now();
    DateTime from;
    switch (resolution) {
      case '1D':
        from = to.subtract(const Duration(days: 1));
        break;
      case '1M':
        from = to.subtract(const Duration(days: 30));
        break;
      case '3M':
        from = to.subtract(const Duration(days: 90));
        break;
      case '1Y':
        from = to.subtract(const Duration(days: 365));
        break;
      default:
        from = to.subtract(const Duration(days: 1));
    }
    final toTimestamp = (to.millisecondsSinceEpoch / 1000).floor();
    final fromTimestamp = (from.millisecondsSinceEpoch / 1000).floor();

    final params = {
      'resolution': resolution,
      'from': fromTimestamp.toString(),
      'to': toTimestamp.toString(),
    };

    final uri = Uri.parse('$_baseUrl/emulate/$symbol/history').replace(queryParameters: params);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Candle.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load candles');
    }
  }

  Future<List<Stock>> searchStocks(String query) async {
    if (query.isEmpty) {
      return [];
    }
    final response = await http.get(Uri.parse('$_baseUrl/emulate/search?q=$query'));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Stock.fromJson(json)).toList();
    } else {
      throw Exception('Failed to search stocks');
    }
  }

  Future<void> submitTrade(Trade trade) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$_baseUrl/trade'),
      headers: headers,
      body: jsonEncode(trade.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to submit trade');
    }
  }

  Future<List<Trade>> getTransactions() async {
    final headers = await _getHeaders();
    final response =
        await http.get(Uri.parse('$_baseUrl/transactions'), headers: headers);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Trade.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load transactions');
    }
  }

  Future<List<Position>> getPositions() async {
    final token = await _authService.getToken();
    final response = await http.get(
      Uri.parse('$_baseUrl/portfolio/positions'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Position.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load positions');
    }
  }
}

final positionsProvider = FutureProvider<List<Position>>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getPositions();
});

final portfolioHistoryProvider = FutureProvider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getPortfolioHistory();
});

final portfolioSummaryProvider = StreamProvider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return Stream.periodic(const Duration(seconds: 1))
      .asyncMap((_) => apiService.getPortfolioSummary());
});
