import 'package:flutter/material.dart';
import "package:flutter_feather_icons/flutter_feather_icons.dart";

class Navbar extends StatelessWidget {
  const Navbar({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: [
        BottomNavigationBarItem(icon: Icon(FeatherIcons.home), label: 'Home'),
        BottomNavigationBarItem(
          icon: Icon(FeatherIcons.pieChart),
          label: 'Search',
        ),
        BottomNavigationBarItem(
          icon: Icon(FeatherIcons.refreshCcw),
          label: 'Cart',
        ),
        BottomNavigationBarItem(
          icon: Icon(FeatherIcons.arrowUpRight),
          label: 'Profile',
        ),
      ],
    );
  }
}

