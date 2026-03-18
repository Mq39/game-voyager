# GameVoyager

GameVoyager is a full-stack web application for browsing and purchasing video games.
It allows users to explore games, view detailed information, manage a cart and wishlist, and authenticate securely through a custom backend.

The application integrates external game data while maintaining a local database for user-related functionality such as cart persistence and wishlist management.

---

## Overview

GameVoyager is built as a modern single-page application with a RESTful backend.
The frontend communicates with a custom API that handles authentication, business logic, and database operations.

The system combines external data from the RAWG API with internally managed data such as users, cart items, and wishlist items, providing a complete end-to-end experience.

---

## Features

* Browse and search video games
* View detailed game information including metadata, screenshots, and trailers
* Add and remove items from the shopping cart
* Add and remove items from the wishlist
* User registration and login with JWT authentication
* Persistent user data stored in a MySQL database
* Responsive interface for desktop and mobile devices
* Avatar generation based on username

---

## Tech Stack

### Frontend

* Vue 3
* TypeScript
* Vue Router
* Bootstrap 5
* Axios
* SweetAlert2

### Backend

* Node.js
* Express
* TypeScript
* MySQL

### External Services

* RAWG API for game data
* DiceBear for avatar generation

---

## Architecture

The application follows a client-server architecture:

* The frontend handles UI rendering, routing, and client-side state
* The backend exposes REST endpoints and business logic
* The database stores users, cart items, wishlist items, and cached game references
* External APIs provide game content that is transformed and consumed by the backend

---

## Project Structure

```text
src/
├── assets/
├── components/
├── composable/
├── models/
├── router/
├── services/
├── utils/
└── views/
```

---

## Installation

### Prerequisites

* Node.js
* npm

---

### Clone the repository

```bash
git clone https://github.com/Mq39/game-voyager
cd game-voyager
```

---

### Install dependencies

```bash
npm install
```

---

### Run the development server

```bash
npm run dev
```

---

## Backend Connection

This frontend connects to the GameVoyager backend API.

Typical backend URLs:

* Local: http://localhost:4000
* Production: your deployed backend URL

Ensure the backend is running before using authentication, cart, or wishlist features.

---

## Core Pages

* Home
* Browse
* Discover
* Game Details
* Cart
* Login
* Register

---

## Key Implementation Details

* Component-based frontend structure
* Reusable composables for authentication and cart state
* Service-based API communication
* Responsive layout with desktop and mobile navigation
* Integration with backend authentication and protected features
* Game data retrieval from backend and RAWG API

---

## Related Repository

Backend repository:
https://github.com/Mq39/game-voyager-backend

---

## Future Improvements

* Payment integration
* User reviews and ratings
* Advanced filtering and sorting
* Recommendation system
* User profiles and order history

---

## License

This project is licensed under the MIT License.

---

## Author

Predrag Mitrović
