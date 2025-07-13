# AI_AGENT Backend

This is the backend for the **AI_AGENT** project, built with Node.js, Express, MongoDB, and Redis. It provides user authentication, registration, profile management, and secure session handling using JWT and Redis for token blacklisting.

## Features

- **User Registration**: Create new users with email and password.
- **User Login**: Authenticate users and issue JWT tokens.
- **Profile Access**: Retrieve authenticated user profile.
- **Logout**: Blacklist JWT tokens using Redis for secure logout.
- **Password Hashing**: Securely store passwords using bcrypt.
- **Validation**: Input validation using express-validator.
- **Environment Configuration**: Uses `.env` for sensitive configs.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Redis

### Installation

1. Clone the repository.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your `.env` file (see provided example).

### Running the Server

```sh
node server.js
```

## API Endpoints

### Register

- **POST** `/users/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "user": { "email": "user@example.com", ... },
    "token": "JWT_TOKEN"
  }
  ```

### Login

- **POST** `/users/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "user": { "email": "user@example.com", ... },
    "token": "JWT_TOKEN"
  }
  ```

### Profile

- **GET** `/users/profile`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**:
  ```json
  {
    "user": { "email": "user@example.com", ... }
  }
  ```

### Logout

- **GET** `/users/logout`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

## Example Usage

#### Register a User

```sh
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Login

```sh
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Get Profile

```sh
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Logout

```sh
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## Environment Variables

See `.env` for required variables:

```
PORT=3000
MONGODB_URL=mongodb://0.0.0.0/AI_AGENT
JWT_SECRET=AI_AGENT-secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password