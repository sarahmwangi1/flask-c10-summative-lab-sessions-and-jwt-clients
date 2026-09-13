# Full Auth Flask Backend - Productivity App

## Overview

This project is a full-stack productivity application built with **Flask**, **SQLAlchemy**, **Flask-Bcrypt**, **Flask-Migrate**, and **React**.

The application provides user authentication using **Flask sessions** and allows authenticated users to create, view, update, and delete their own notes.

Each user's notes are protected so that users can only access and modify notes that belong to their account.

---

## Technologies Used

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-Bcrypt
* SQLite
* Flask Sessions

### Frontend

* React
* React Router
* Styled Components
* JavaScript

---

## Project Structure

```text
flask-c10-summative-lab-sessions-and-jwt-clients/
│
├── client-with-sessions/
│   ├── public/
│   ├── src/
│   │   └── components/
│   │       ├── App.js
│   │       ├── Login.js
│   │       ├── LoginForm.js
│   │       ├── SignUpForm.js
│   │       └── NavBar.js
│   └── package.json
│
├── client-with-jwt/
│
├── server/
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── instance/
│   │   └── app.db
│   └── migrations/
│
└── README.md
```

---

## Features

### User Authentication

Users can:

* Create an account
* Log in
* Check their current session
* Log out
* Receive appropriate validation and authentication responses

Passwords are securely hashed using **Flask-Bcrypt** rather than being stored as plain text.

### Notes

Authenticated users can:

* Create notes
* View their notes
* Update their notes
* Delete their notes

Users can only access notes belonging to their own account.

---

## Authentication

This project uses **Flask session authentication**.

When a user successfully logs in, their user ID is stored in the Flask session.

Protected routes check the session before allowing access to user-specific resources.

The frontend communicates with the backend using `fetch()` requests and includes credentials so that the session cookie is maintained.

---

## API Routes

### Authentication

| Method | Route            | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/signup`        | Creates a new user                 |
| POST   | `/login`         | Logs a user in                     |
| GET    | `/check_session` | Checks whether a user is logged in |
| DELETE | `/logout`        | Logs the current user out          |

### Notes

| Method | Route         | Description                                      |
| ------ | ------------- | ------------------------------------------------ |
| GET    | `/notes`      | Returns the logged-in user's notes               |
| POST   | `/notes`      | Creates a new note                               |
| GET    | `/notes/<id>` | Returns one note belonging to the logged-in user |
| PATCH  | `/notes/<id>` | Updates a user's note                            |
| DELETE | `/notes/<id>` | Deletes a user's note                            |

Protected note routes require an authenticated session.

---

## Data Models

### User

The `User` model contains:

* `id`
* `username`
* `password_hash`

Usernames are unique.

Passwords are hashed using Flask-Bcrypt.

### Note

The `Note` model contains:

* `id`
* `title`
* `content`
* `user_id`

Each note belongs to a specific user through the `user_id` foreign key.

---

## Validation and Access Control

The backend validates user input before creating or updating records.

Authentication is required for protected routes.

A user cannot access, edit, or delete another user's notes.

The backend verifies the logged-in user's ID against the note's `user_id` before performing protected operations.

---

## Database

The application uses **SQLite** for local development.

The database is located at:

```text
server/instance/app.db
```

Database migrations are managed using **Flask-Migrate**.

To create a migration after changing the models:

```bash
flask --app app db migrate -m "Describe your changes"
```

To apply migrations:

```bash
flask --app app db upgrade
```

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install the project dependencies with Pipenv:

```bash
pipenv install
```

Activate the virtual environment:

```bash
pipenv shell
```

Initialize the database if necessary:

```bash
flask --app app db upgrade
```

Start the Flask development server:

```bash
flask --app app run --port 5555
```

The backend runs at:

```text
http://localhost:5555
```

---

## Frontend Setup

Open another terminal and navigate to the sessions client:

```bash
cd client-with-sessions
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The React frontend communicates with the Flask backend running on port `5555`.

---

## Example Signup Request

```json
{
  "username": "sarah",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Example request:

```text
POST /signup
```

---

## Example Login Request

```json
{
  "username": "sarah",
  "password": "password123"
}
```

Example request:

```text
POST /login
```

---

## Error Handling

The API returns appropriate HTTP status codes and JSON responses for situations such as:

* Missing required fields
* Invalid credentials
* Duplicate usernames
* Password confirmation mismatch
* Unauthenticated requests
* Requests for notes that do not belong to the current user
* Requests for resources that do not exist

---

## Running the Application

Start the Flask backend first:

```bash
cd server
pipenv shell
flask --app app run --port 5555
```

Then, in a separate terminal, start the React application:

```bash
cd client-with-sessions
npm start
```

Open the React application in the browser and use the signup and login forms to authenticate.

Once logged in, the application can communicate with the protected notes API.

---

## Testing the Backend

The Flask API can be tested using the browser, Postman, curl, or the React frontend.

For example, to test whether the backend is running:

```bash
curl http://localhost:5555/
```

The authentication endpoints can then be tested by creating a user, logging in, checking the session, accessing notes, and logging out.

---

## Security

This application demonstrates several basic authentication and authorization practices:

* Passwords are hashed with Flask-Bcrypt.
* User sessions are used to identify authenticated users.
* Protected routes require authentication.
* Users can only access their own notes.
* Password hashes are never returned to the client.

---

## Learning Objectives

This project demonstrates understanding of:

* Building a Flask REST API
* Creating SQLAlchemy models and relationships
* Using Flask-Migrate
* Hashing passwords with Bcrypt
* Implementing session-based authentication
* Protecting API routes
* Implementing CRUD operations
* Connecting a React frontend to a Flask backend
* Managing user-specific resources
* Handling HTTP status codes and JSON responses

---

## Author

**Sarah Mwangi**

