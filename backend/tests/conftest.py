import sys
from pathlib import Path

import pytest

from backend.app.database.connection import get_connection, test_database_connection


ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def db_available() -> bool:
    return test_database_connection()


@pytest.fixture
def farm_id():
    if not db_available():
        pytest.skip("database not connected")

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO farms (name, species, animal_count, latitude, longitude)
                VALUES ('PRANA Test Farm', 'cattle', 20, 10.123, 76.456)
                RETURNING id
                """
            )
            inserted_id = cur.fetchone()[0]
        conn.commit()

    yield str(inserted_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM farms WHERE id = %s", (inserted_id,))
        conn.commit()