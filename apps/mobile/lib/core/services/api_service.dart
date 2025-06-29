import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:stockmarket/models/portfolio_history.dart';
import 'package:stockmarket/models/portfolio_summary.dart';
import 'package:stockmarket/models/stock.dart';
import 'package:stockmarket/models/trade.dart';

class ApiService {
  final String _baseUrl = 'http://127.0.0.1:3000/api';

  Future<PortfolioSummary> getPortfolioSummary() async {
    final response = await http.get(Uri.parse('$_baseUrl/portfolio/summary'));

    if (response.statusCode == 200) {
      return PortfolioSummary.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load portfolio summary');
    }
  }

  Future<PortfolioHistory> getPortfolioHistory() async {
    final response = await http.get(Uri.parse('$_baseUrl/portfolio/history'));

    if (response.statusCode == 200) {
      return PortfolioHistory.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load portfolio history');
    }
  }

  Future<List<Stock>> getAvailableStocks() async {
    final response = await http.get(Uri.parse('$_baseUrl/stocks'));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Stock.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load available stocks');
    }
  }

  Future<double> getStockPrice(String symbol) async {
    final response = await http.get(Uri.parse('$_baseUrl/stocks/$symbol/price'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['price'] as num).toDouble();
    } else {
      throw Exception('Failed to load stock price');
    }
  }

  Future<void> submitTrade(Trade trade) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/trade'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(trade.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to submit trade');
    }
  }
} 