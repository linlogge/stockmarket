class PortfolioHistory {
  final List<String> labels;
  final List<double> data;

  PortfolioHistory({required this.labels, required this.data});

  factory PortfolioHistory.fromJson(Map<String, dynamic> json) {
    return PortfolioHistory(
      labels: List<String>.from(json['labels']),
      data: List<double>.from(json['data'].map((d) => (d as num).toDouble())),
    );
  }
} 