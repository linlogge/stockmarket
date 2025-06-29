import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:stockmarket/core/routing/no_transition_page.dart' as custom;
import 'package:stockmarket/core/services/auth_service.dart';
import 'package:stockmarket/features/auth/views/login_view.dart';
import 'package:stockmarket/features/home/views/home_view.dart';
import 'package:stockmarket/features/profile/views/profile_view.dart';
import 'package:stockmarket/features/trade/views/trade_view.dart';
import 'package:stockmarket/core/widgets/scaffold_with_nav_bar.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStatusProvider);

  // We need to notify the router when the auth state changes.
  // This can be done by creating a separate notifier provider.
  final authNotifier = ref.watch(authNotifierProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/home',
    refreshListenable: authNotifier,
    redirect: (BuildContext context, GoRouterState state) {
      // While the auth state is loading, don't redirect.
      if (authState.isLoading || authState.hasError) return null;

      final isLoggedIn = authState.value!;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoggingIn) {
        return '/login';
      }
      if (isLoggedIn && isLoggingIn) {
        return '/home';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        pageBuilder: (context, state) =>
            custom.NoTransitionPage(child: LoginView()),
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        pageBuilder: (context, state, child) {
          return custom.NoTransitionPage(
            child: Scaffold(
              body: child,
              bottomNavigationBar: BottomNavigationBar(
                items: const <BottomNavigationBarItem>[
                  BottomNavigationBarItem(
                    icon: Icon(Icons.home),
                    label: 'Home',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.swap_horiz),
                    label: 'Trade',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.person),
                    label: 'Profile',
                  ),
                ],
                currentIndex: _calculateSelectedIndex(state),
                onTap: (int idx) => _onItemTapped(idx, context),
              ),
            ),
          );
        },
        routes: <RouteBase>[
          GoRoute(
            path: '/home',
            pageBuilder: (context, state) =>
                custom.NoTransitionPage(child: HomeView()),
          ),
          GoRoute(
            path: '/trade',
            pageBuilder: (context, state) =>
                custom.NoTransitionPage(child: TradeView()),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) =>
                custom.NoTransitionPage(child: ProfileView()),
          ),
        ],
      ),
    ],
  );
});

// This notifier is used to refresh the router when auth state changes.
final authNotifierProvider = Provider((ref) {
  return GoRouterRefreshStream(ref.watch(authStatusProvider.future));
});

int _calculateSelectedIndex(GoRouterState state) {
  final String location = state.matchedLocation;
  if (location.startsWith('/home')) {
    return 0;
  }
  if (location.startsWith('/trade')) {
    return 1;
  }
  if (location.startsWith('/profile')) {
    return 2;
  }
  return 0;
}

void _onItemTapped(int index, BuildContext context) {
  switch (index) {
    case 0:
      GoRouter.of(context).go('/home');
      break;
    case 1:
      GoRouter.of(context).go('/trade');
      break;
    case 2:
      GoRouter.of(context).go('/profile');
      break;
  }
}

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Future<dynamic> future) {
    notifyListeners();
    _subscription =
        future.asStream().listen((_) => notifyListeners());
  }
  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
} 