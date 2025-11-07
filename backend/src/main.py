import fastapi

from typing import Union

backend = fastapi.FastAPI()

@backend.get("/")
def root():
    return "Hello World"

@backend.post("/api")
def api():
    pass