import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

backend_package = types.ModuleType("backend")
backend_package.__path__ = [str(ROOT)]
sys.modules["backend"] = backend_package

from backend.app.main import app
