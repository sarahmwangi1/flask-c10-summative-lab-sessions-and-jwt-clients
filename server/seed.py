from app import app, db
from models import User, Note


with app.app_context():
    print("Clearing existing data...")

    Note.query.delete()
    User.query.delete()

    print("Creating users...")

    user1 = User(username="alice")
    user1.set_password("password123")

    user2 = User(username="bob")
    user2.set_password("password123")

    db.session.add_all([user1, user2])
    db.session.commit()

    print("Creating notes...")

    note1 = Note(
        title="Alice's First Note",
        content="This is Alice's first seeded note.",
        user_id=user1.id
    )

    note2 = Note(
        title="Alice's Second Note",
        content="Alice is learning Flask sessions and CRUD.",
        user_id=user1.id
    )

    note3 = Note(
        title="Bob's First Note",
        content="This is Bob's first seeded note.",
        user_id=user2.id
    )

    db.session.add_all([note1, note2, note3])
    db.session.commit()

    print("Seed completed successfully!")
    print(f"Users created: {User.query.count()}")
    print(f"Notes created: {Note.query.count()}")
