from fastapi import APIRouter, HTTPException, Request
import sqlite3
from pydantic import BaseModel

router = APIRouter()

conn = sqlite3.connect("electionManagementDB.db", check_same_thread=False)
cursor = conn.cursor()

class Candidate(BaseModel):
    candidateID:   int
    workerID:      int


@router.post("/elect")
def elect(candidate: Candidate):
    try:
        cursor.execute(f"SELECT voted FROM workers WHERE workerID = {candidate.workerID}")
        row = cursor.fetchone()
        if row[0] == True:
            raise HTTPException(status_code=400, detail="WorkerID_VOTED") from e
        else:
            cursor.execute(f"""
                UPDATE candidates SET votes = votes+1 WHERE candidateID = {candidate.candidateID};
            """)
            cursor.execute(f"""
                UPDATE workers SET voted = TRUE WHERE workerID = {candidate.workerID};
            """)
            conn.commit()
            print("we got the vote")
            return {"message": "vote registered successfully"}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=500, detail="Database error: IntegrityError") from e


@router.get("/elect")
def canElected(workerID: int):
    try:
        cursor.execute(f"SELECT voted FROM workers WHERE workerID = {workerID};")
        row = cursor.fetchone()
        if row[0]:
            return {"can_elect": False}
        else:
            return {"can_elect": True}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=500, detail="Database error: IntegrityError") from e

@router.get("/candidates")
def get_candidates():
    try:
        # Fetch firstName, lastName, and votes for all candidates from the database
        candidates_in_db = cursor.execute("SELECT firstName, lastName, votes FROM candidates").fetchall()
        
        # Convert the result into a list of dictionaries
        candidates = [
            {"firstName": row[0], "lastName": row[1], "votes": row[2]}
            for row in candidates_in_db
        ]
        
        return {"candidates": candidates}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=500, detail="Database error: IntegrityError") from e