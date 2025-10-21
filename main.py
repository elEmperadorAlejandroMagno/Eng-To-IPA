"""
Entry point for Render deployment
"""
from server.app.main import app

# Expose the FastAPI app for uvicorn
__all__ = ["app"]