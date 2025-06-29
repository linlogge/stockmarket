import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:stockmarket/core/constants.dart';
import 'package:stockmarket/core/services/auth_service.dart';
import 'package:stockmarket/models/portfolio_history.dart';
import 'package:stockmarket/models/portfolio_summary.dart';
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
  final String _baseUrl = API_BASE_URL;

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
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl/stocks'), headers: headers);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Stock.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load available stocks');
    }
  }

  Future<double> getStockPrice(String symbol) async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl/stocks/$symbol/price'), headers: headers);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['price'] as num).toDouble();
    } else {
      throw Exception('Failed to load stock price');
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
  return Stream.periodic(const Duration(seconds: 2))
      .asyncMap((_) => apiService.getPortfolioSummary());
}); 