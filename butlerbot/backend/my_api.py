from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
async def test_endpoint():
    return JSONResponse(content={"success": "this is just a test to get the data"})