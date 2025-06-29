import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart' hide NoTransitionPage;
import 'package:stockmarket/core/routing/no_transition_page.dart';
import 'package:stockmarket/features/home/views/home_view.dart';
import 'package:stockmarket/features/profile/views/profile_view.dart';
import 'package:stockmarket/features/trade/views/trade_view.dart';
import 'package:stockmarket/core/widgets/scaffold_with_nav_bar.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  initialLocation: '/home',
  navigatorKey: _rootNavigatorKey,
  routes: [
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        return ScaffoldWithNavBar(child: child);
      },
      routes: [
        GoRoute(
          path: '/home',
          pageBuilder: (context, state) => NoTransitionPage(
            child: HomeView(),
          ),
        ),
        GoRoute(
          path: '/trade',
          pageBuilder: (context, state) => NoTransitionPage(
            child: TradeView(),
          ),
        ),
        GoRoute(
          path: '/profile',
          pageBuilder: (context, state) => NoTransitionPage(
            child: ProfileView(),
          ),
        ),
      ],
    ),
  ],
); 