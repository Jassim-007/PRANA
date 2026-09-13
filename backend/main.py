import sys
import types
from pathlib import Path

# Vercel runs this service with `backend/` as its root.
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

# Make the existing `backend.app...` imports work without
# changing the actual backend application code.
backend_package = types.ModuleType("backend")
backend_package.__path__ = [str(ROOT)]
sys.modules["backend"] = backend_package

from backend.app.main import app as fastapi_app


class StripApiPrefix:
    """
    Vercel sends API requests as /api/...

    Most PRANA routes already include /api in their FastAPI
    router prefix, so those paths must remain unchanged.

    Only the FastAPI health routes are defined without /api:
        /health
        /health/database

    Therefore we strip /api only for those two routes.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope["path"]

            if path == "/api/health" or path == "/api/health/database":
                scope = dict(scope)
                scope["path"] = path[4:]
                scope["raw_path"] = scope["path"].encode("utf-8")

        await self.app(scope, receive, send)


# Vercel entrypoint
app = StripApiPrefix(fastapi_app)