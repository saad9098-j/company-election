from fastapi import APIRouter, HTTPException, Request
import sqlite3
from pydantic import BaseModel
import bcrypt

router = APIRouter()
# connect to the database
conn = sqlite3.connect("electionManagementDB.db", check_same_thread=False)
cursor = conn.cursor()
# create the worker class
class Worker(BaseModel):
    workerID:   int
    firstName:  str
    lastName:   str
    birthdate:  str
    email:      str
    gender:     str
    password:   str
    isCandidate: bool

# HTTP post request
@router.post("/register")
def register(worker: Worker):
    try:
        # check if the workerID is already in table and raise exception if true
        cursor.execute(f"SELECT * FROM workers WHERE workerID = {worker.workerID};")
        row = cursor.fetchone()
        if row:
            raise HTTPException(status_code=400, detail="WORKERID_EXISTS")
        print("passed first checkpoint")
        # hash the password
        hashed_password = bcrypt.hashpw(worker.password.encode('utf-8'), bcrypt.gensalt())

        # insert the worker into table with the values (logged and voted are initially false) and send success message
        if worker.isCandidate:
            maxCandidateID = cursor.execute("SELECT MAX(candidateID) FROM candidates").fetchone()[0]
            if not maxCandidateID:
                maxCandidateID = 0
            print("passed hier", maxCandidateID)
            cursor.execute("""
            INSERT INTO candidates (candidateID, firstName, lastName, birthdate, email, gender, workerID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (maxCandidateID+1, worker.firstName, worker.lastName, worker.birthdate, worker.email, worker.gender, worker.workerID))
            print("passed hier 2")
            cursor.execute("""
                INSERT INTO workers (workerID, firstName, lastName, birthdate, email, gender, password, electable, logged, voted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (worker.workerID, worker.firstName, worker.lastName, worker.birthdate, worker.email, worker.gender, hashed_password, True, False, False))
            conn.commit()
        else:
            cursor.execute("""
                INSERT INTO workers (workerID, firstName, lastName, birthdate, email, gender, password, electable, logged, voted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (worker.workerID, worker.firstName, worker.lastName, worker.birthdate, worker.email, worker.gender, hashed_password, False, False, False))
            conn.commit()
        
        return {"message": "Worker registered successfully!"}
    # catch integrity errors
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=500, detail="DATABASE_ERROR") from e