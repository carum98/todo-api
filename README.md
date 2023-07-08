# ToDo API

API RESTful Designed in Node.js for a simple TODO application.

## Index
* [Setup](#setup)
* [Development](#development)
* [Production](#production)
* [Testing](#testing)
* [End-Points](#end-points)

## Setup
The API use .env file to set the environment variables. You can create a `.env` or rename the `.env.example`.

| Name                 | Description                          |
|----------------------|--------------------------------------|
|PORT                  |Port to expose the API                |
|DB_DATABASE           |Name of data base                     |
|DB_PASSWORD           |Password of the database              |
|SECRET_TOKEN          |Secret to sign the Token (JWT)        |
|SECRET_REFRESH_TOKEN  |Secret to sign the Refresh Token (JWT)|

Generate secret: 

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Use
This project use Docker Compose to defining the Docker containers (Node and MySQL). You can run in 3 different environments (Development, Production and Testing), to facilitate the use of any of these 3 enviroments it is recommended to use `./bash.sh`.

### Development
```bash
 ./run.sh --test
```

### Production
```bash
 ./run.sh --prod
```

### Testing
```bash
 ./run.sh --test
```

## End-Points
| Method | End-Point         |                              |
|--------|-------------------|------------------------------|
|`POST`  |`/register`           |[See](#post-register)      |
|`POST`  |`/login`              |[See](#post-login)         |
|`POST`  |`/refresh-token`      |[See](#post-refresh-token) |
|`POST`  |`/lists`              |[See](#post-lists)         |
|`GET`   |`/lists`              |[See](#get-lists)          |
|`GET`   |`/lists/:id`          |[See](#get-listsid)        |
|`PUT`   |`/lists/:id`          |[See](#put-listsid)        |
|`DELETE`|`/lists/:id`          |[See](#delete-listsid)     |
|`POST`  |`/lists/:id/todos`    |[See](#post-listsidtodos)  |
|`GET`   |`/lists/:id/todos`    |[See](#get-listsidtodos)   |
|`POST`  |`/todos`              |[See](#post-todos)         |
|`GET`   |`/todos`              |[See](#get-todos)          |
|`GET`   |`/todos/:id`          |[See](#get-todosid)        |
|`PUT`   |`/todos/:id`          |[See](#put-todosid)        |
|`POST`  |`/todos/:id/complete` |[See](#delete-todosid)     |
|`DELETE`|`/todos/:id`          |[See](#delete-todosid)     |

------

### Authentication

#### POST /register
##### Request
```json
{
    "name": "Carlos",
    "user_name": "carlos98",
    "password": "12345"
}
```
##### Response
```json
{
    "token": "eyJhbGciOiJIUzI1XiIsInR5cCI8IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk5IiwiaWF0IjoxNjg4ODQxNjA1LCJleHAiOjE2ODg4NDA4MDV9.t1ArMpU8Fy2jK7jEfj7dwDSJv-23vXRuZiH0PgQm33g",
    "refreshToken": "eyJhbGciOiJIUzT1NiIsInR5cCI6ILpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk4IiwiaWF0IjoxNjg4ODQxNjA1LCXleHAiOjE2ODg4NDUyMDV8.6qt9nmmWlSeWnZp31ByLfBU55FKBr5ct1MFgiHbutZ8",
    "expiredAt": 1688842805135
}
```

#### POST /login
##### Request
```json
{
    "user_name": "carlos98",
    "password": "12345"
}
```
##### Response
```json
{
    "token": "eyJhbGciOiJIUzI1XiIsInR5cCI8IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk5IiwiaWF0IjoxNjg4ODQxNjA1LCJleHAiOjE2ODg4NDA4MDV9.t1ArMpU8Fy2jK7jEfj7dwDSJv-23vXRuZiH0PgQm33g",
    "refreshToken": "eyJhbGciOiJIUzT1NiIsInR5cCI6ILpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk4IiwiaWF0IjoxNjg4ODQxNjA1LCXleHAiOjE2ODg4NDUyMDV8.6qt9nmmWlSeWnZp31ByLfBU55FKBr5ct1MFgiHbutZ8",
    "expiredAt": 1688842805135
}
```

#### POST /refresh-token
##### Request
```json
{
    "refresh": "eyJhbGciOiJIUzI1XiIsInR5cCI8IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk5IiwiaWF0IjoxNjg4ODQxNjA1LCJleHAiOjE2ODg4NDA4MDV9.t1ArMpU8Fy2jK7jEfj7dwDSJv-23vXRuZiH0PgQm33g"
}
```
##### Response
```json
{
    "token": "eyJhbGciOiJIUzI1XiIsInR5cCI8IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk5IiwiaWF0IjoxNjg4ODQxNjA1LCJleHAiOjE2ODg4NDA4MDV9.t1ArMpU8Fy2jK7jEfj7dwDSJv-23vXRuZiH0PgQm33g",
    "refreshToken": "eyJhbGciOiJIUzT1NiIsInR5cCI6ILpXVCJ9.eyJ1c2VyX25hbWUiOiJjYXJ1bTk4IiwiaWF0IjoxNjg4ODQxNjA1LCXleHAiOjE2ODg4NDUyMDV8.6qt9nmmWlSeWnZp31ByLfBU55FKBr5ct1MFgiHbutZ8",
    "expiredAt": 1688842805135
}
```

------

### List

#### POST /lists
##### Request
```json
{
    "name": "University",
    "color": "#283593"
}
```
##### Response
```json
{
    "id": 1,
    "name": "University",
    "color": "#283593"
}
```
#### GET /lists
##### Response
```json
{
    "data": [
        {
            "id": 1,
            "name": "University",
            "color": "#283593"
        }
    ]
}
```
#### GET /lists/:id
##### Response
```json
{
    "id": 1,
    "name": "University",
    "color": "#283593"
}
```
#### PUT /lists/:id
##### Request
```json
{
    "name": "University Edit",
}
```
##### Response
```json
{
    "id": 1,
    "name": "University Edit",
    "color": "#283593"
}
```
#### POST /lists/:id/todos
##### Request
```json
{
    "title": "TODO Test",
    "description": "This is a todo description"
}
```
##### Response
```json
{
    "id": 1,
    "title": "TODO Test",
    "description": "This is a todo description",
    "is_complete": false
}
```
#### GET /lists/:id/todos
##### Response
```json
{
    "data": [
        {
            "id": 1,
            "title": "TODO Test",
            "description": "This is a todo description",
            "is_complete": false
        }
    ]
```
#### DELETE /lists/:id
##### Response
204 No Content

------

### ToDos

#### POST /todos
##### Request
```json
{
    "title": "TODO Test",
    "description": "This is a todo description",
    "list_id": 1
}
```
##### Response
```json
{
    "id": 1,
    "title": "TODO Test",
    "description": "This is a todo description",
    "is_complete": false
}
```
#### GET /todos
##### Response
```json
{
    "data": [
        {
            "id": 1,
            "title": "TODO Test",
            "description": "This is a todo description",
            "is_complete": false
        }
    ]
}
```
#### GET /todos/:id
##### Response
```json
{
    "id": 1,
    "title": "TODO Test",
    "description": "This is a todo description",
    "is_complete": false
}
```
#### PUT /todos/:id
##### Request
```json
{
    "title": "TODO Test Edit",
}
```
##### Response
```json
{
    "id": 1,
    "title": "TODO Test Edit",
    "description": "This is a todo description",
    "is_complete": false
}
```
#### POST /todos/:id/complete
##### Response
```json
{
    "id": 1,
    "title": "TODO Test",
    "description": "This is a todo description",
    "is_complete": true
}
```
#### DELETE /todos/:id
##### Response
204 No Content
