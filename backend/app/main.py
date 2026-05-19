from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()  
from app.routes.upload import router as upload_router
from app.routes.evaluate import router as evaluate_router
from app.routes import recommendations
from app.routes.auth import router as auth_router
from app.routes.recommendations import router as rec_router
from app.routes.contact import router as contact_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://heroic-generosity-production-71c7.up.railway.app",
    ],
    allow_origin_regex=r"https://crim-.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(auth_router)
app.include_router(rec_router)
app.include_router(contact_router)


@app.get("/")
def root():
    return {"message": "CRIM API is running"}
