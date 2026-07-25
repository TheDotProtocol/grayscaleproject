import 'package:flutter/material.dart';

void main() {
  runApp(const GrayscaleApp());
}

class GrayscaleApp extends StatelessWidget {
  const GrayscaleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Project Grayscale',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.dark(
          primary: const Color(0xFF6366F1),
          surface: const Color(0xFF18181B),
        ),
        scaffoldBackgroundColor: const Color(0xFF09090B),
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Project Grayscale'),
        backgroundColor: const Color(0xFF18181B),
      ),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Run Your Company Like You\nAlready Have an Executive Team.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 16),
              Text(
                'Mobile app scaffold — connect to API at localhost:4000',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF71717A)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
