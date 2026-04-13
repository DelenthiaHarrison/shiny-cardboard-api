# Shiny Cardboard API

A REST API for tracking and managing Trading Card Game (TCG) collections. Built as a final project for a backend development course, this API allows collectors to manage their card collections, browse card sets, and identify missing cards needed to complete a set.

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework for building the REST API
- **Prisma** — ORM for database access and schema management
- **PostgreSQL** — Relational database (hosted on Prisma cloud)
- **Git/GitHub** — Version control

## Setup Instructions

1. Clone the repository:
```bash
   git clone https://github.com/DelenthiaHarrison/shiny-cardboard-api.git
   cd shiny-cardboard-api
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file in the root directory and add your database connection string:

## Postman Documentation

A Postman collection with example requests and responses for all endpoints is included in this repository as `postman_collection.json`.

To use it:
1. Open Postman
2. Click **Import**
3. Select the `postman_collection.json` file
4. All endpoints will be ready to test with example data