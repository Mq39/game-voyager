# GameVoyager

GameVoyager is a full-stack web application for browsing and purchasing video games.
It allows users to explore games, view detailed information, manage a cart and wishlist, and authenticate securely through a custom backend.

The application integrates external game data while maintaining a local database for user-related functionality such as cart persistence and wishlist management.

---

## Overview

GameVoyager is built as a modern single-page application with a RESTful backend.
The frontend communicates with a custom API that handles authentication, business logic, and database operations.

The system combines external data (RAWG API) with internally managed data (users, cart, wishlist), providing a complete end-to-end experience.

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

### Backend

* Node.js
* Express
* TypeScript

### Database

* MySQL

### External Services

* RAWG API (game data)
* DiceBear (avatar generation)

---

## Architecture

The application follows a typical client-server architecture:

* The frontend (Vue) handles UI, routing, and state management
* The backend (Express) exposes REST endpoints and business logic
* The database (MySQL) stores users, cart items, wishlist items, and cached game data
* External APIs provide game content that is transformed and consumed by the backend

---

## Project Structure

### Frontend

```
src/
├── components/
├── composable/
├── models/
├── router/
├── services/
├── utils/
├── views/
└── assets/
```

### Backend

```
src/
├── controllers/
├── routes/
├── middleware/
├── db/
├── models/
└── server.ts
```

---

## Installation

### Prerequisites

* Node.js
* npm
* MySQL

---

### Clone Repositories

```bash
git clone https://github.com/Mq39/game-voyager
git clone https://github.com/Mq39/game-voyager-backend
```

---

### Backend Setup

```bash
cd game-voyager-backend
npm install
```

Create a `.env` file in the root of the backend project:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=game_voyager
JWT_SECRET=your_secret
RAWG_API_KEY=your_rawg_api_key
```

Start the backend server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd game-voyager
npm install
npm run dev
```

---

## Environment Variables

The backend requires the following environment variables:

* `PORT` – server port
* `DB_HOST` – database host
* `DB_PORT` – database port
* `DB_USER` – database username
* `DB_PASSWORD` – database password
* `DB_NAME` – database name
* `JWT_SECRET` – secret used for signing tokens
* `RAWG_API_KEY` – API key for RAWG

---

## API Overview

The backend exposes the following route groups:

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Games

* GET `/api/games/hero`
* GET `/api/games/popular`
* GET `/api/games/search`
* GET `/api/games/browse`
* GET `/api/games/:id`
* GET `/api/games/:id/screenshots`
* GET `/api/games/:id/movies`

### Cart

* GET `/api/cart`
* POST `/api/cart`
* PATCH `/api/cart/:gameId`
* DELETE `/api/cart/:gameId`

### Wishlist

* GET `/api/wishlist`
* POST `/api/wishlist`
* DELETE `/api/wishlist/:gameId`

Detailed API documentation is available in the `API.md` file.

---

## Database

The application uses a relational database with the following core tables:

* `users` – user accounts and credentials
* `games` – locally stored game references
* `cart_items` – user cart data
* `wishlist_items` – user wishlist data

Game data is partially cached locally to reduce external API calls and improve performance.

---

## Key Implementation Details

* JWT-based authentication with protected routes
* Middleware for request validation and authorization
* Separation of concerns via controllers, services, and composables
* External API integration with data transformation
* Persistent state management for cart and wishlist
* Clean modular project structure

---

## Future Improvements

* Payment system integration
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
