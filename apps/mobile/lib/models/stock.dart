class Stock {
  final String symbol;
  final String company;

  Stock({required this.symbol, required this.company});

  factory Stock.fromJson(Map<String, dynamic> json) {
    return Stock(
      symbol: json['symbol'],
      company: json['company'],
    );
  }

  @override
  String toString() {
    return '$symbol - $company';
  }
} 