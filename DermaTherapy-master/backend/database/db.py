import psycopg2
from dotenv import load_dotenv
import os


class UserDBHandler:
    def __init__(self):
        load_dotenv()
        self.user = os.getenv("user")
        self.password = os.getenv("password")
        self.host = os.getenv("host")
        self.port = os.getenv("port")
        self.dbname = os.getenv("dbname")

        self.connection = None
        self.cursor = None
        self.user_cache = {}  # email -> user dict

        self.connect()

    def connect(self):
        try:
            self.connection = psycopg2.connect(
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port,
                dbname=self.dbname
            )
            self.cursor = self.connection.cursor()
            print("🔌 Database connected successfully.")
        except Exception as e:
            print(f"❌ Failed to connect: {e}")

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("🚪 Connection closed.")

    def add_user(self, auth_id, email, full_name=None):
        try:
            self.cursor.execute("""
                INSERT INTO users (auth_id, email, full_name)
                VALUES (%s, %s, %s)
                RETURNING id;
            """, (auth_id, email, full_name))
            user_id = self.cursor.fetchone()[0]
            self.connection.commit()

            # Store in cache
            self.user_cache[email] = {
                "id": user_id,
                "auth_id": auth_id,
                "email": email,
                "full_name": full_name
            }

            print(f"✅ User {email} added.")
            return user_id
        except Exception as e:
            print(f"❌ Error adding user: {e}")
            self.connection.rollback()
            return None

    def get_user_by_email(self, email):
        if email in self.user_cache:
            print(f"⚡ User fetched from cache: {email}")
            return self.user_cache[email]
        try:
            self.cursor.execute("SELECT id, auth_id, email, full_name FROM users WHERE email = %s", (email,))
            row = self.cursor.fetchone()
            if row:
                user_data = {
                    "id": row[0],
                    "auth_id": row[1],
                    "email": row[2],
                    "full_name": row[3]
                }
                self.user_cache[email] = user_data  # Cache it
                return user_data
            return None
        except Exception as e:
            print(f"❌ Error fetching user: {e}")
            return None

    def user_exists(self, email):
        return self.get_user_by_email(email) is not None

    def update_user_name(self, email, new_name):
        try:
            self.cursor.execute("UPDATE users SET full_name = %s, updated_at = NOW() WHERE email = %s",
                                (new_name, email))
            self.connection.commit()

            # Update cache
            if email in self.user_cache:
                self.user_cache[email]['full_name'] = new_name

            print(f"📝 Updated name for {email}")
            return True
        except Exception as e:
            print(f"❌ Error updating user name: {e}")
            self.connection.rollback()
            return False
