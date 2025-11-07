import fastapi

from typing import Union
from fastapi.middleware.cors import CORSMiddleware

backend = fastapi.FastAPI()
origins = [
    "https://localhost:3000", 
]

backend.add_middleware(
    CORSMiddleware, 
    allow_origins= origins,
    allow_credentials = True,
    allow_methods = ["POST", "GET",], 
    allow_headers = ["*"]
)

@backend.get("/")
def root():
    return "Hello World"

@backend.post("/api/ai/search")
def aiServices():
    return {}

@backend.get("api/services")
def services():
    return {"I am a teapot.": "I am a teapot."}

@backend.post("api/services/search")
def searchServices():
    return {}

@backend.post("/api/community/message")
def sendMessage():
    return {}

@backend.get("/api/community/wall")
def get_message():
    return {"Wall": {"Brick": "Cement"}}

