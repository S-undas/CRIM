from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.evaluate import router as evaluate_router

app = FastAPI()

# Allow requests from our React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "CRIM API is running"}