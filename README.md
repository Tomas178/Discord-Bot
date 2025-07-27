# Discord bot with a REST API

## Features

- POST /messages - send a congratulatory message to a server on Discord and save data in database
- GET /messages - get a list of all congratulatory messages
- GET for /messages?username=johndoe&sprint=WD-1.1 - get a list of all congratulatory messages for a specific user and sprint
- GET /messages?username=johdoe - get a list of all congratulatory messages for a specific user
- GET /messages?sprint=WD-1.1 - get a list of all congratulatory messages for a specific sprint
- CRUD /templates - POST/GET/PATCH/DELETE endpoints for managing congratulatory message templates
- CRUD /sprints - POST/GET/PATCH/DELETE endpoints for managing sprints
- Send congratulatory message to all discord servers that bot is a part of
- Send a DM to tagged user on the congratulatory message

## How to use it

### Module `messages`

- ### Route `/messages`

  - #### GET request - just call it
  - #### GET request by username and sprint

    ❗ username and sprint must be given in query `/messages?username=Username&sprint=WD-1.1`\
     ❗ sprint must match this pattern `Course-Module.Sprint`

  - #### GET request by username

    ❗ username must be given in query `/messages?username=Username`

  - #### GET request by sprint

    ❗ sprint must be given in query `/messages?sprint=WD-1.1`\
     ❗ sprint must match this pattern `Course-Module.Sprint`

  - #### POST request
    ```json
    {
      "username": "Username",
      "sprint": "WD-1.1",
      "templateId": "1" # optional
    }
    ```
    ❗ sprint must match this pattern `Course-Module.Sprint`

- ### Route `/messages/:id`
  - #### GET request - just call it

### Module `sprints`

- ### Route `/sprints`

  - #### GET request - just call it

  - #### POST request

    ```json
    {
      "sprintCode": "WD-1.1",
      "sprintTitle": "Python basics"
    }
    ```

    ❗ sprintCode must match this pattern `Course-Module.Sprint`\
     ❗ ID must be given in query `/sprints?id=${id}`

  - #### PATCH request

    ```json
        {
            "sprintCode": "WD-1.1", - optional
            "sprintTitle": "Python basics" - optional
        }
    ```

    ❗ ID must be given in query `/sprints?id=${id}`

  - #### DELETE request
    ❗ ID must be given in query `/sprints?id=${id}`

- ### Route `/sprints/:id`

  - #### GET request - just call it

  - #### PATCH request

    ```json
    {
      "sprintCode": "WD-1.1",
      "sprintTitle": "Python basics"
    }
    ```

    ❗ sprintCode must match this pattern `Course-Module.Sprint`

  #### DELETE request - just call it

### Module `templates`

- ### Route `/templates`

  - #### GET request - just call it

  - #### POST request

    ```json
    {
      "templateMessage": "{username} has just completed {sprintTitle}!\n ..."
    }
    ```

    ❗ templateMessage must match this pattern `{username} has just completed {sprintTitle}!\n any additional congratulatory message`

  - #### PATCH request

    ```json
    {
      "templateMessage": "{username} has just completed {sprintTitle}!\n ..."
    }
    ```

    ❗ ID must be given in query `/templates?id=${id}`\
     ❗ templateMessage must match this pattern `{username} has just completed {sprintTitle}!\n any additional congratulatory message`

  - #### DELETE request
    ❗ ID must be given in query `/templates?id=${id}`

- ### Route `/templates/:id`

  - #### GET request - just call it

  - #### PATCH request

    ```json
    {
      "templateMessage": "{username} has just completed {sprintTitle}!\n ..."
    }
    ```

    ❗ templateMessage must match this pattern `{username} has just completed {sprintTitle}!\n any additional congratulatory message`

  - #### DELETE request - just call it

## Installation guide

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Postman](https://www.postman.com/downloads/) - for making API calls

### Setup

```bash
git clone https://github.com/TuringCollegeSubmissions/tompetro-WD2.3.3.5.git
cd tompetro-WD2.3.3.5
npm install
```

### Forming database file

#### Environment variables

- <a href="https://developers.giphy.com/docs/api/endpoint/" target="_blank">GIPHY_API_KEY</a>
- <a href="https://discord.com/developers/applications" target="_blank">DISCORD_BOT_TOKEN</a>

```bash
mkdir data / create 'data' folder at the root of the project
Set up the .env file
npm run migrate:latest
```

### Setting up username in Discord server

❗ Change Discord username in server to the one that you make **POST** requests to `/messages`

**Example:**\
if Discord username in server is `Username` then the **POST** request to `/messages` should be made like that:/

```json
{
  "username": "Username",
  "sprint": "WD-1.1"
}
```

❗ sprint must match this pattern `Course-Module.Sprint`

### Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

### Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run gen:types
```

### Link to Peer programming exercise

<a href="https://github.com/Tomas178/Back-end-practice/tree/main" target="_blank">Peer programming Exercise</a>
