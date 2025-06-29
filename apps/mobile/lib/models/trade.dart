class Trade {
  final String symbol;
  final int quantity;
  final String action;

  Trade({required this.symbol, required this.quantity, required this.action});

  Map<String, dynamic> toJson() {
    return {
      'symbol': symbol,
      'quantity': quantity,
      'action': action,
    };
  }
} 