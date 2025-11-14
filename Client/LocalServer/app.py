import uvicorn
from fastapi import FastAPI

app = FastAPI()


# website page
@app.get("/")
def start():
    return {"start": "start_webpage"}


@app.get("/global_config")
def global_config():
    return {"global_config": "global_config_webpage"}


@app.get("/tasks")
def tasks():
    return {"tasks": "tasks_webpage"}


@app.get("/history")
def history():
    return {"history": "history_webpage"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
