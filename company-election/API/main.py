from fastapi import FastAPI
from routes import loginEndpoint, registerEndpoint, electionEndpoint
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from the frontend (adjust URL as needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, including POST
    allow_headers=["*"],  # Allows all headers
)

# Include the individual routers for each endpoint
app.include_router(loginEndpoint.router, prefix="/loginEndpoint", tags=["loginEndpoint"])
app.include_router(registerEndpoint.router, prefix="/registerEndpoint", tags=["registerEndpoint"])
app.include_router(electionEndpoint.router, prefix="/electionEndpoint", tags=["electionEndpoint"])

@app.get('/')
def read_root():
    return {"message": "Welcome to the Voting System API"}
