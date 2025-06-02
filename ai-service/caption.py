# caption.py - Updated FastAPI server with better CORS handling
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(title="Live Caption Application")

# CORS middleware configuration - specifically allow your Angular app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Your Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Mount the static directory to serve CSS and JS files
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
else:
    print("Warning: 'static' directory not found. Static files will not be served.")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    """Serve the index.html file"""
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            html_content = f.read()
            return html_content
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="index.html not found")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "ok"}


# Add an API endpoint that Angular can test to verify connectivity
@app.get("/api/test")
async def test_api():
    """Test endpoint for the Angular app to verify connectivity"""
    return {"message": "Connection successful"}


if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8000))

    print(f"Starting server at http://localhost:{port}")
    print(f"CORS is enabled for: http://localhost:4200 (your Angular app)")

    # Use host 0.0.0.0 to make it accessible from outside the container/VM
    uvicorn.run(app, host="0.0.0.0", port=port)