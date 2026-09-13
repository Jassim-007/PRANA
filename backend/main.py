import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

backend_package = types.ModuleType("backend")
backend_package.__path__ = [str(ROOT)]
sys.modules["backend"] = backend_package

from backend.app.main import app as fastapi_app


class StripApiPrefix:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["path"].startswith("/api"):
            scope = dict(scope)
            scope["path"] = scope["path"][4:] or "/"
            scope["raw_path"] = scope["path"].encode("utf-8")
        await self.app(scope, receive, send)


app = StripApiPrefix(fastapi_app)