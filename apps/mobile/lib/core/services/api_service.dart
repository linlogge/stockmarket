import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:stockmarket/models/portfolio_summary.dart';

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
} 