# Backend Documentation

This is the documentation for the StockMarket backend.

## Overview

The backend is a lightweight, asynchronous web server built in Rust using the Axum framework. It is designed to be stateless (with the exception of the in-memory transaction history) and serves as a simple JSON API for the frontend application.

## Core Technologies

-   **Rust**: A memory-safe, fast, and concurrent programming language, providing a robust foundation for the server.
-   **Axum**: A modern and ergonomic web framework built on top of Tokio, Tower, and Hyper. It is used for routing, request handling, and state management.
-   **Tokio**: The asynchronous runtime for Rust, enabling the server to handle many connections concurrently without blocking.
-   **Serde**: A powerful framework for serializing and deserializing Rust data structures efficiently. It is used for all JSON request and response handling.
-   **JSON Web Tokens (JWT)**: Used for stateless user authentication. The server generates a token on successful login, which the client then includes in subsequent requests.
-   **Tower-HTTP**: Provides middleware for common HTTP concerns, specifically used here for Cross-Origin Resource Sharing (CORS) to allow the frontend to communicate with the API.

## Key Architectural Concepts

-   **State Management**: For features requiring shared data across requests (like the transaction history), the backend uses Axum's `State` extractor. A shared `AppState` struct, protected by a `Mutex`, is created at startup and injected into handlers that need it.
-   **Modular Handlers**: Each API endpoint is handled by a dedicated asynchronous function (e.g., `login`, `get_stock_price`, `handle_trade`). This keeps the routing logic clean and the request handling code organized.
-   **Stateless Authentication**: The server uses JWTs for authentication, which means it does not need to store session state on the server side. The user's identity is verified by validating the JWT sent with each request. 