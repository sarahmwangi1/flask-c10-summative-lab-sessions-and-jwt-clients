# Full Auth Flask Backend – Productivity Tool

## Project Description

This project is a full-stack productivity tool built with Flask and React.

The backend provides session-based authentication and a protected Notes resource. Users can create an account, log in, log out, and check their current session. Authenticated users can create, view, update, and delete their own notes.

The application demonstrates Flask authentication, password protection with bcrypt, SQLAlchemy database relationships, CRUD operations, protected routes, database migrations, seed data, and pagination.

## Technologies Used

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-Bcrypt
* SQLite

### Frontend

* React
* React Router
* Styled Components

## Project Structure

```text
flask-c10-summative-lab-sessions-and-jwt-clients/
├── server/
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── seed.py
│   └── migrations/
├── client-with-sessions/
│   └── src/
├── client-with-jwt/
│   └── src/
└── README.md
```

## Authentication

This project uses Flask sessions for authentication.

When a user successfully signs up or logs in, their user ID is stored in the Flask session:

```python
session["user_id"] = user.id
```

Protected routes use the session to determine which user is making the request.

Passwords are never stored as plain text. They are securely hashed using Flask-Bcrypt.

## Backend Installation

Navigate to the server directory:

```bash
cd server
```

Create and activate the Python environment if needed.

Install the required dependencies:

```bash
pipenv install
```

Enter the Pipenv environment:

```bash
pipenv shell
```

## Database Setup

Initialize the database migrations if the migration setup has not already been created:

```bash
flask db upgrade
```

The application uses SQLite for the database.

## Seed the Database

To create starter users and notes, run:

```bash
python seed.py
```

The seed file creates:

* User `alice`
* User `bob`
* Sample notes belonging to each user

The seeded password for both users is:

```text
password123
```

## Running the Backend

From the `server` directory:

```bash
python app.py
```

The Flask API runs on:

```text
http://localhost:5555
```

## Running the Sessions React Client

Open another terminal and navigate to:

```bash
cd client-with-sessions
```

Install the frontend dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The sessions client runs on:

```text
http://localhost:4000
```

The React client is configured to proxy API requests to the Flask backend on port `5555`.

## Authentication API Routes

### Sign Up

```http
POST /signup
```

Example request:

```json
{
  "username": "alice",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Login

```http
POST /login
```

Example request:

```json
{
  "username": "alice",
  "password": "password123"
}
```

### Check Session

```http
GET /check_session
```

Returns the currently logged-in user or an empty object when no user is logged in.

### Logout

```http
DELETE /logout
```

Removes the user's session.

## Notes API Routes

All Notes routes are protected and require a logged-in user.

### Get Notes

```http
GET /notes
```

Returns only notes belonging to the logged-in user.

### Create a Note

```http
POST /notes
```

Example request:

```json
{
  "title": "My Note",
  "content": "This is my note."
}
```

### Get One Note

```http
GET /notes/<id>
```

### Update a Note

```http
PATCH /notes/<id>
```

Example request:

```json
{
  "title": "Updated Note",
  "content": "Updated content."
}
```

### Delete a Note

```http
DELETE /notes/<id>
```

## Pagination

The Notes index route supports pagination using `page` and `per_page` query parameters.

Example:

```http
GET /notes?page=1&per_page=10
```

The response includes the notes and pagination information such as:

* Current page
* Items per page
* Total notes
* Total pages

## Authorization and Ownership

Users can only access their own notes.

For example, Alice can access Alice's notes, but she cannot view, update, or delete Bob's notes.

Unauthenticated requests to protected Notes routes return:

```http
401 Unauthorized
```

Requests for notes that do not belong to the logged-in user return:

```http
404 Not Found
```

## Testing

The application can be tested by:

1. Creating a new account.
2. Logging in.
3. Checking the active session.
4. Creating a note.
5. Viewing notes.
6. Editing a note.
7. Deleting a note.
8. Logging out.
9. Confirming protected routes reject unauthenticated requests.
10. Logging in as another user and confirming users only see their own notes.

## Author

Sarah Mwangi
