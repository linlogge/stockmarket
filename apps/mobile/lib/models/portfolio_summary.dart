class PortfolioSummary {
  final double portfolioValue;
  final double daysGain;
  final double daysGainPercent;

  PortfolioSummary({
    required this.portfolioValue,
    required this.daysGain,
    required this.daysGainPercent,
  });

  factory PortfolioSummary.fromJson(Map<String, dynamic> json) {
    return PortfolioSummary(
      portfolioValue: (json['portfolio_value'] as num).toDouble(),
      daysGain: (json['days_gain'] as num).toDouble(),
      daysGainPercent: (json['days_gain_percent'] as num).toDouble(),
    );
  }
} 