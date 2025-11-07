import fastapi

from typing import Union

backend = fastapi.FastAPI()

@backend.get("/")
def root():
    return "Hello World"

@backend.get("api/services")
def services():
    return {"I am a teapot.": "I am a teapot."}

@backend.post("api/ai/recommendations")

@backend.post("api/services/search")
def searchServices():
    return {}

@backend.post("/api/community/message")
def sendMessage():
    pass

@backend.get("/api/community/wall")
def get_message():
    return {"Wall": {"Brick": "Cement"}}