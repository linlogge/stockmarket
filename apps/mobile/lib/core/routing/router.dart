import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:stockmarket/features/home/views/home_view.dart';
import 'package:stockmarket/features/trade/views/trade_view.dart';
import 'package:stockmarket/features/profile/views/profile_view.dart';
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
          builder: (context, state) => const HomeView(),
        ),
        GoRoute(
          path: '/trade',
          builder: (context, state) => const TradeView(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileView(),
        ),
      ],
    ),
  ],
); 