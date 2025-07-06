class Candle {
  final double open;
  final double high;
  final double low;
  final double close;
  final int volume;
  final int timestamp;

  Candle({
    required this.open,
    required this.high,
    required this.low,
    required this.close,
    required this.volume,
    required this.timestamp,
  });

  factory Candle.fromJson(Map<String, dynamic> json) {
    return Candle(
      open: (json['open'] as num).toDouble(),
      high: (json['high'] as num).toDouble(),
      low: (json['low'] as num).toDouble(),
      close: (json['close'] as num).toDouble(),
      volume: json['volume'] as int,
      timestamp: json['timestamp'] as int,
    );
  }
} 