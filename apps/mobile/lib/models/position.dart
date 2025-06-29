class Position {
  final String symbol;
  final String company;
  final int shares;
  final double price;
  final double change;
  final double changePercent;
  final double value;

  Position({
    required this.symbol,
    required this.company,
    required this.shares,
    required this.price,
    required this.change,
    required this.changePercent,
    required this.value,
  });

  factory Position.fromJson(Map<String, dynamic> json) {
    return Position(
      symbol: json['symbol'],
      company: json['company'],
      shares: json['shares'],
      price: json['price'].toDouble(),
      change: json['change'].toDouble(),
      changePercent: json['change_percent'].toDouble(),
      value: json['value'].toDouble(),
    );
  }
} 