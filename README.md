# ToDo API

API RESTful Designed in Node.js for a simple TODO application.

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
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`