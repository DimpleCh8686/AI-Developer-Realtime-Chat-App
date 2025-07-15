# AI_AGENT Backend

This is the backend for the **AI_AGENT** project, built with Node.js, Express, MongoDB, and Redis. It provides user authentication, registration, profile management, and secure session handling using JWT and Redis for token blacklisting.

## Features

- **User Registration**: Create new users with email and password.
- **User Login**: Authenticate users and issue JWT tokens.
- **Profile Access**: Retrieve authenticated user profile.
- **Logout**: Blacklist JWT tokens using Redis for secure logout.
- **List Users**: Get all users except the logged-in user.
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

---

### 5. List All Users

**GET** `/users/all`

#### Headers

```
Authorization: Bearer JWT_TOKEN
```

#### Example (cURL)

```sh
curl -X GET http://localhost:3000/users/all \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
#### Response

```json
{
  "users": [
    {
      "_id": "other_user_id",
      "email": "other@example.com"
    }
    // ...more users
  ]
}
```
---

## Notes

- All endpoints except `/register` and `/login` require a valid JWT token.
- Passwords are securely hashed using bcrypt.
- Logout blacklists the token for 24 hours using Redis.

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
```

## Project Service & Routes

This section explains how to use the **Project Service** endpoints for creating, listing, updating, and retrieving projects.

### 1. Create Project

**POST** `/projects/create`

#### Headers

```
Authorization: Bearer JWT_TOKEN
```

#### Request Body

```json
{
  "name": "My First Project"
}
```

#### Example (cURL)

```sh
curl -X POST http://localhost:3000/projects/create \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Project"}'
```

#### Response

```json
{
  "_id": "project_id",
  "name": "my first project",
  "users": ["user_id"]
}
```

---

### 2. List All Projects for User

**GET** `/projects/all`

#### Headers

```
Authorization: Bearer JWT_TOKEN
```

#### Example (cURL)

```sh
curl -X GET http://localhost:3000/projects/all \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Response

```json
{
  "projects": [
    {
      "_id": "project_id",
      "name": "my first project",
      "users": ["user_id", "collaborator_id"]
    }
    // ...more projects
  ]
}
```

---

### 3. Add Users to Project

**PUT** `/projects/add-user`

#### Headers

```
Authorization: Bearer JWT_TOKEN
```

#### Request Body

```json
{
  "projectId": "project_id",
  "users": ["collaborator_id_1", "collaborator_id_2"]
}
```

#### Example (cURL)

```sh
curl -X PUT http://localhost:3000/projects/add-user \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"project_id","users":["collaborator_id_1","collaborator_id_2"]}'
```

#### Response

```json
{
  "_id": "project_id",
  "name": "my first project",
  "users": ["user_id", "collaborator_id_1", "collaborator_id_2"]
}
```

---

### 4. Get Project by ID

**GET** `/projects/get-project/:projectId`

#### Headers

```
Authorization: Bearer JWT_TOKEN
```

#### Example (cURL)

```sh
curl -X GET http://localhost:3000/projects/get-project/project_id \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Response

```json
{
  "_id": "project_id",
  "name": "my first project",
  "users": [
    {
      "_id": "user_id",
      "email": "user@example.com"
    },
    {
      "_id": "collaborator_id_1",
      "email": "collab1@example.com"
    }
    // ...more users
  ]
}
```

---

## Notes

- All project endpoints require a valid JWT token.
- Only authenticated users can create, view, or update projects.
- Project names must be unique.
- Collaborators are managed