from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router

app = FastAPI()

# Allow requests from our React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our upload router with a prefix
# This means our endpoint will be at /api/upload
app.include_router(upload_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "CRIM API is running"}