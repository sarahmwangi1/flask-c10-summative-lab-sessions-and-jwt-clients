from flask import Flask, request, session

from extensions import db, bcrypt, migrate
from models import User, Note


app = Flask(__name__)


# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# Session configuration
app.config["SECRET_KEY"] = "development-secret-key-change-this-later"
app.config["SESSION_COOKIE_HTTPONLY"] = True


# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
migrate.init_app(app, db)


@app.route("/")
def index():
    return {"message": "Productivity API is running!"}


# -------------------------
# AUTHENTICATION ROUTES
# -------------------------

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")
    password_confirmation = data.get("password_confirmation")

    if not username or not password or not password_confirmation:
        return {
            "errors": [
                "Username, password, and password confirmation are required."
            ]
        }, 422

    if password != password_confirmation:
        return {
            "errors": ["Passwords do not match."]
        }, 422

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return {
            "errors": ["Username already exists."]
        }, 422

    user = User(username=username)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return user.to_dict(), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {
            "errors": ["Username and password are required."]
        }, 422

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return {
            "errors": ["Invalid username or password."]
        }, 401

    session["user_id"] = user.id

    return user.to_dict(), 200


@app.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")

    if not user_id:
        return {}, 200

    user = db.session.get(User, user_id)

    if not user:
        session.pop("user_id", None)
        return {}, 200

    return user.to_dict(), 200


@app.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)

    return {}, 200


# -------------------------
# NOTES ROUTES
# -------------------------

@app.route("/notes", methods=["GET"])
def get_notes():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    notes = Note.query.filter_by(user_id=user_id).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return {
        "notes": [note.to_dict() for note in notes.items],
        "pagination": {
            "page": notes.page,
            "per_page": notes.per_page,
            "total": notes.total,
            "pages": notes.pages
        }
    }, 200


@app.route("/notes", methods=["POST"])
def create_note():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    data = request.get_json() or {}

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return {
            "errors": ["Title and content are required."]
        }, 422

    note = Note(
        title=title,
        content=content,
        user_id=user_id
    )

    db.session.add(note)
    db.session.commit()

    return note.to_dict(), 201


@app.route("/notes/<int:note_id>", methods=["GET"])
def get_note(note_id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    note = Note.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return {"error": "Note not found"}, 404

    return note.to_dict(), 200


@app.route("/notes/<int:note_id>", methods=["PATCH"])
def update_note(note_id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    note = Note.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return {"error": "Note not found"}, 404

    data = request.get_json() or {}

    if "title" in data:
        if not data["title"]:
            return {"errors": ["Title cannot be empty."]}, 422
        note.title = data["title"]

    if "content" in data:
        if not data["content"]:
            return {"errors": ["Content cannot be empty."]}, 422
        note.content = data["content"]

    db.session.commit()

    return note.to_dict(), 200


@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    note = Note.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return {"error": "Note not found"}, 404

    db.session.delete(note)
    db.session.commit()

    return {}, 200


# -------------------------
# START APPLICATION
# -------------------------

if __name__ == "__main__":
    app.run(port=5555, debug=True)
