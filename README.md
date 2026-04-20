# Shiny Cardboard API

A REST API for tracking and managing Trading Card Game (TCG) collections.

**Live API:** https://shiny-cardboard-api.onrender.com

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Jest + Supertest
- Render (deployment)

## User Roles

- **User** - Register, login, manage own collections, view cards and sets
- **Admin** - All user permissions plus create, update, delete cards and sets

## Setup Instructions

1. Clone the repo: git clone https://github.com/DelenthiaHarrison/shiny-cardboard-api.git
2. Install dependencies: npm install
3. Create .env file with DATABASE_URL and JWT_SECRET
4. Run: npx prisma generate && npx prisma migrate dev
5. Seed: npm run seed
6. Start: npm run dev

## Authentication

POST /auth/register - Register new user
POST /auth/login - Login and get JWT token
GET /auth/me - Get current user (requires token)

Add token to requests: Authorization: Bearer your-token

## API Endpoints

### Sets
GET /sets - Get all sets (public)
GET /sets/:id - Get single set (public)
POST /sets - Create set (admin only)
PUT /sets/:id - Update set (admin only)
DELETE /sets/:id - Delete set (admin only)

### Cards
GET /cards - Get all cards (public)
GET /cards/:id - Get single card (public)
POST /cards - Create card (admin only)
PUT /cards/:id - Update card (admin only)
DELETE /cards/:id - Delete card (admin only)

### Collections
GET /collections - Get user collections (auth required)
GET /collections/:id - Get single collection (owner only)
POST /collections - Create collection (auth required)
POST /collections/:id/cards - Add card to collection (owner only)
PUT /collections/:id - Update collection (owner only)
DELETE /collections/:id - Delete collection (owner only)
GET /collections/sets/:setId/missing - Get uncollected cards (auth required)

## Database Schema

- User - username, email, password, role
- Set - name, setCode, series, totalCards, releaseDate
- Card - name, cardNumber, rarity, type, artist, imageUrl, setId
- Collection - name, userId
- CollectionCard - collectionId, cardId, quantity, condition

Relationships

- User has many Collections
- Collection has many CollectionCards (junction table)
- Card has many CollectionCards
- Set has many Cards

## Running Tests

npm test

16 tests across 4 suites covering auth, sets, cards, and collections.

## Future Improvements

- Trade offer system
- Price history tracking
- Card variants
- Collection analytics
- Premium user tier


## Deployment

Live API: https://shiny-cardboard-api.onrender.com

## Postman Documentation

A Postman collection is included in this repository as Shiny Cardboard API.postman_collection.json

To use it:
1. Open Postman
2. Click Import
3. Select the file
4. All endpoints ready to test