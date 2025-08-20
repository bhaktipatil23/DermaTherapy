import jwt # type: ignore
import os

SUPABASE_JWT_SECRET = os.getenv("SUPABASE-SECRET-KEY")

def verify_token(token):
    try:
        decoded = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"  # 👈 Most common value in Supabase
        )

        return decoded
    except Exception as e:
        print("JWT verification error:", e)
        return None
