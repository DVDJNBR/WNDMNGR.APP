"""
WNDMNGR - Main entry point for cloud deployment (Render, etc.)
"""
import os
from app import page
from taipy.gui import Gui

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 5000))

    # Run the app - bind to 0.0.0.0 for cloud deployment
    Gui(page=page).run(
        host="0.0.0.0",
        port=port,
        title="WNDMNGR",
        dark_mode=False
    )
