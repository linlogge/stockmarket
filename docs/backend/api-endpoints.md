# API Endpoints

The backend exposes a RESTful JSON API. All endpoints are prefixed with `/api`.

---

### Authentication

#### `POST /api/login`

Authenticates a user and returns a JSON Web Token (JWT).

-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "user_password"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "token": "a.jwt.token"
    }
    ```
-   **Error Response (401 Unauthorized)**: Returned if credentials are invalid.

#### `POST /api/logout`

A placeholder endpoint to signify a user has logged out. In a stateless JWT architecture, this doesn't do much on the server side, but it's good practice to have.

-   **Success Response (200 OK)**

---

### Portfolio

#### `GET /api/portfolio/summary`

Returns a summary of the user's portfolio, with simulated, randomly fluctuating data.

-   **Success Response (200 OK)**:
    ```json
    {
        "portfolio_value": 125123.45,
        "days_gain": 250.10,
        "days_gain_percent": 0.002
    }
    ```

#### `GET /api/portfolio/history`

Returns historical data for the main portfolio chart.

-   **Success Response (200 OK)**:
    ```json
    {
        "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "data": [124160.76, 124500.50, 124800.90, 124650.20, 125120.34, 125300.10, 125364.21]
    }
    ```
---

### Stocks & Trading

#### `GET /api/stocks`

Returns a list of all available stocks for trading.

-   **Success Response (200 OK)**:
    ```json
    [
      { "symbol": "AAPL", "company": "Apple Inc." },
      { "symbol": "GOOGL", "company": "Alphabet Inc." }
    ]
    ```

#### `GET /api/stocks/:symbol/price`

Returns the simulated current price for a specific stock symbol.

-   **URL Parameter**:
    -   `symbol`: The stock symbol (e.g., `AAPL`).
-   **Success Response (200 OK)**:
    ```json
    {
        "symbol": "AAPL",
        "price": 162.50
    }
    ```

#### `POST /api/trade`

Submits a trade. The trade is added to the in-memory transaction history.

-   **Request Body**:
    ```json
    {
      "symbol": "AAPL",
      "quantity": 10,
      "action": "Buy"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "message": "Trade for Buy 10 AAPL successful!"
    }
    ```

#### `GET /api/transactions`

Returns the list of all trades made since the server started.

-   **Success Response (200 OK)**:
    ```json
    [
      { "symbol": "AAPL", "quantity": 10, "action": "Buy" },
      { "symbol": "GOOGL", "quantity": 5, "action": "Sell" }
    ]
    ``` 