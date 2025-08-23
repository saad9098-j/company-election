from fastapi import APIRouter, HTTPException
import sqlite3
from pydantic import BaseModel
import bcrypt

router = APIRouter()
# connect to the database
conn = sqlite3.connect("electionManagementDB.db", check_same_thread=False)
cursor = conn.cursor()

# create the worker class (here we take logged to differentiate between log in and log out in the frontend)
class Worker(BaseModel):
    workerID:   int
    password:   str
    logged:     bool
# HTTP POST request
@router.post("/login")
def login(worker: Worker):
    # here the worker is trying to log in
    if not (worker.logged):
        try:
            # get the password of this worker in the table and simultaniously check if he even exists and raise exception if not
            cursor.execute(f"SELECT * FROM workers WHERE workerID = {worker.workerID}")
            row = cursor.fetchone()
            print(row)
            if row is None:
                raise HTTPException(status_code=400, detail="WorkerID_NOT_REGISTERED")
            # ckeck if worker is logged somewhere else
            if row[8] == True:
                raise HTTPException(status_code=400, detail="WORKERID_ALREADY_LOGGED")
            saved_password = row[6]
            # check if passwords match, update logged to true and send success if true, else send error
            if bcrypt.checkpw(worker.password.encode('utf-8'), saved_password):
                cursor.execute(f"UPDATE workers SET logged = {True} WHERE workerID = {worker.workerID}")
                conn.commit()
                return {"message": "Worker logged in successfully"}
            else:
                raise HTTPException(status_code=400, detail="WRONG_PASSWORD")
        # integrity check
        except sqlite3.IntegrityError as e:
            raise HTTPException(status_code=500, detail="DATABASE_ERROR") from e
    # and here the worker is trying to log out
    else:
        try:
            # set logged to false
            cursor.execute(f"UPDATE workers SET logged = {False} WHERE workerID = {worker.workerID}")
            conn.commit()
            print("worker logged out")
        # except integrity error
        except sqlite3.IntegrityError as e:
            raise HTTPException(status_code=500, detail="DATABASE_ERROR") from e
