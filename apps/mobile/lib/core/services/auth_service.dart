import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:stockmarket/core/constants.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

class AuthService {
  final _storage = const FlutterSecureStorage();
  final String _baseUrl = API_BASE_URL;
  static const _tokenKey = 'auth_token';

  Future<void> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        try {
          final data = jsonDecode(response.body);
          final token = data['token'];
          if (token == null) {
            throw Exception('Token is null in response');
          }
          await _storage.write(key: _tokenKey, value: token);
        } catch (e) {
          throw Exception('Failed to process successful login response: $e');
        }
      } else {
        throw Exception(
            'Failed to login with status code: ${response.statusCode}');
      }
    } catch (e) {
      // Re-throw the exception to be caught by the UI
      rethrow;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
}

final authStatusProvider = FutureProvider<bool>((ref) {
  return ref.watch(authServiceProvider).isLoggedIn();
}); 