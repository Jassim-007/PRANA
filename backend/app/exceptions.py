from fastapi import HTTPException
from psycopg import Error as DatabaseError
from psycopg.errors import ForeignKeyViolation, InvalidTextRepresentation


def raise_database_http_error(exc: Exception, fallback: str = "Database error") -> None:
    """Map database failures to safe HTTP errors. Never leak connection details."""
    if isinstance(exc, ForeignKeyViolation):
        raise HTTPException(status_code=400, detail="Referenced record was not found") from None

    if isinstance(exc, InvalidTextRepresentation):
        raise HTTPException(status_code=400, detail="Invalid identifier format") from None

    if isinstance(exc, DatabaseError):
        raise HTTPException(status_code=500, detail=fallback) from None

    raise HTTPException(status_code=500, detail=fallback) from None
