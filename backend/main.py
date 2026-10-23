import os
import sys

# Ensure backend root is in sys.path so app modules are resolvable anywhere
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

__all__ = ["app"]
