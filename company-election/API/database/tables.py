import sqlite3

con = sqlite3.connect("electionManagementDB.db")

cur = con.cursor()

#con.execute("""CREATE TABLE candidates (
#                candidateID INTEGER NOT NULL PRIMARY KEY,
#                firstName TEXT,
#                lastName,
#                birthdate DATE,
#                email TEXT UNIQUE,
#                gender TEXT,
#                workerID INTEGER NOT NULL,
#                FOREIGN KEY(workerID) REFERENCES workers(workerID)
#                )""")

#con.execute("""INSERT INTO candidates (candidateID, firstName, lastName, birthdate, email, gender, workerID) VALUES 
#                (1, 'Tom', 'Cat', '1940-02-10', 'tom.cat@cartoons.com', 'Male', 101), 
#                (2, 'Jerry', 'Mouse', '1940-02-10', 'jerry.mouse@cartoons.com', 'Male', 102), 
#                (3, 'Bugs', 'Bunny', '1938-07-27', 'bugs.bunny@cartoons.com', 'Male', 103), 
#                (4, 'Daffy', 'Duck', '1937-04-17', 'daffy.duck@cartoons.com', 'Male', 104), 
#                (5, 'Tweety', 'Bird', '1942-11-21', 'tweety.bird@cartoons.com', 'Non-binary', 105)
#                (6, 'Popeye', 'Sailor', '1929-01-17', 'popeye@sailors.com', 'Male', 6);""")
con.close()