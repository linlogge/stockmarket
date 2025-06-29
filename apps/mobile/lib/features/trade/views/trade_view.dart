import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stockmarket/core/providers/api_providers.dart';
import 'package:stockmarket/models/stock.dart';
import 'package:stockmarket/models/trade.dart';

class TradeView extends ConsumerStatefulWidget {
  const TradeView({super.key});

  @override
  ConsumerState<TradeView> createState() => _TradeViewState();
}

class _TradeViewState extends ConsumerState<TradeView> {
  final _formKey = GlobalKey<FormState>();
  final _quantityController = TextEditingController();
  String _tradeAction = 'Buy';
  Stock? _selectedStock;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  void _resetForm() {
    _formKey.currentState?.reset();
    _quantityController.clear();
    // Invalidate providers to refetch data on next successful trade
    ref.invalidate(portfolioSummaryProvider);
    ref.invalidate(portfolioHistoryProvider);
    setState(() {
      _selectedStock = null;
    });
  }

  Future<void> _submitTrade() async {
    if (_isSubmitting) return;

    if (_formKey.currentState!.validate()) {
      if (_selectedStock == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Please select a valid stock from the list.')),
        );
        return;
      }

      setState(() {
        _isSubmitting = true;
      });

      try {
        final trade = Trade(
          symbol: _selectedStock!.symbol,
          quantity: int.parse(_quantityController.text),
          action: _tradeAction,
        );
        await ref.read(apiServiceProvider).submitTrade(trade);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Trade successful!'),
            backgroundColor: Colors.green,
          ),
        );
        _resetForm();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Trade failed: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      } finally {
        if (mounted) {
          setState(() {
            _isSubmitting = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final availableStocksAsync = ref.watch(availableStocksProvider);
    final selectedSymbol = _selectedStock?.symbol;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Trade'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              availableStocksAsync.when(
                data: (stocks) => Autocomplete<Stock>(
                  displayStringForOption: (Stock option) => option.toString(),
                  optionsBuilder: (TextEditingValue textEditingValue) {
                    if (textEditingValue.text == '') {
                      return const Iterable<Stock>.empty();
                    }
                    return stocks.where((Stock option) {
                      final optionText = option.toString().toLowerCase();
                      final query = textEditingValue.text.toLowerCase();
                      return optionText.contains(query);
                    });
                  },
                  onSelected: (Stock selection) {
                    setState(() {
                      _selectedStock = selection;
                    });
                  },
                  fieldViewBuilder:
                      (context, controller, focusNode, onFieldSubmitted) {
                    return TextFormField(
                      controller: controller,
                      focusNode: focusNode,
                      onChanged: (value) {
                        // If user types something that doesn't match the selected stock, clear it
                        if (_selectedStock != null &&
                            value != _selectedStock.toString()) {
                          setState(() {
                            _selectedStock = null;
                          });
                        }
                      },
                      decoration: const InputDecoration(
                        labelText: 'Symbol',
                        hintText: 'Type to search...',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a symbol.';
                        }
                        if (_selectedStock == null) {
                          return 'Please select a valid stock from the list.';
                        }
                        return null;
                      },
                    );
                  },
                ),
                loading: () =>
                    const Center(child: CircularProgressIndicator()),
                error: (err, stack) => Center(
                  child: Text('Error loading stocks: $err'),
                ),
              ),
              const SizedBox(height: 8),
              if (selectedSymbol != null)
                Consumer(
                  builder: (context, ref, child) {
                    final priceAsync =
                        ref.watch(stockPriceProvider(selectedSymbol));
                    return priceAsync.when(
                      data: (price) => Text(
                        'Current Price: ${price.toStringAsFixed(2)} €',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      loading: () => const Text('Fetching price...'),
                      error: (err, stack) =>
                          const Text('Could not fetch price.'),
                    );
                  },
                )
              else
                const SizedBox(height: 19), // Match height of price display
              const SizedBox(height: 16),
              TextFormField(
                controller: _quantityController,
                decoration: const InputDecoration(
                  labelText: 'Quantity',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null ||
                      value.isEmpty ||
                      int.tryParse(value) == null ||
                      int.parse(value) <= 0) {
                    return 'Please enter a valid quantity.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _tradeAction,
                decoration: const InputDecoration(
                  labelText: 'Action',
                  border: OutlineInputBorder(),
                ),
                items: ['Buy', 'Sell'].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _tradeAction = newValue!;
                  });
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitTrade,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Submit Trade'),
              )
            ],
          ),
        ),
      ),
    );
  }
} 