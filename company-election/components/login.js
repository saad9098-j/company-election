export default {
  template: `
    <div>
      <div v-if="loggedIn" class="success-container">
        <h1>You are logged in</h1>
        <form @submit.prevent="home">
          <button type="submit">Go to home</button>
        </form>
        <form @submit.prevent="vote">
          <button type="submit">Go to vote</button>
        </form>
        <form @submit.prevent="logout">
          <button type="submit">Log out</button>
        </form>
      </div>

      <div v-else class="register-page">
        <h1>Results</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="workerID">Worker ID:</label>
            <input type="text" id="workerID" v-model="worker.workerID" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="worker.password" required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      worker: {
        workerID: "",
        password: "",
      },
      loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false,
    };
  },
  methods: {
    login() {
      console.log("ID: ", this.worker.workerID);
      console.log("password: ", this.worker.password);

      const apiUrl = "http://127.0.0.1:8000/loginEndpoint/login";
      const requestBody = {
        ...this.worker,
        logged: false,
      };
      fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      .then(async response => {
        const data = await response.json(); // Parse JSON response
        if (!response.ok) {
            console.log("Error received from backend:", data);
            throw data; // Throw the parsed JSON error
        }
        return data; // Return parsed JSON if no error
      })
      .then((data) => {
        //console.log('Response Data:', data);
        this.loggedIn = true;
        localStorage.setItem("loggedIn", JSON.stringify(true)); // Save to localStorage
        localStorage.setItem("workerID", JSON.stringify(this.worker.workerID));
        this.worker = {
          workerID: "",
          password: "",
        };
      })
      .catch((error) => {
        // console.error("Caught error:", error);  // Log the error in the console for debugging
        if (error.detail === "WRONG_PASSWORD") {
          alert("Password is incorrect");
        } else if (error.detail === "WorkerID_NOT_REGISTERED") {
          alert(`WorkerID is not registered`);
        } else {
          alert(`An error occurred: ${error.detail}`);
        }
        localStorage.removeItem("workerID");
        localStorage.removeItem("loggedIn");
        location.reload();
      });

    },
    logout() {
      this.worker.workerID = JSON.parse(localStorage.getItem("workerID"));
      console.log("ID: ", this.worker.workerID);
      console.log("password: ", this.worker.password);

      const apiUrl = "http://127.0.0.1:8000/loginEndpoint/login";
      const requestBody = {
        ...this.worker,
        logged: true,
      };
      fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      .then(async response => {
        const data = await response.json(); // Parse JSON response
        if (!response.ok) {
            console.log("Error received from backend:", data);
            throw data; // Throw the parsed JSON error
        }
        return data; // Return parsed JSON if no error
      })
      .then((data) => {
        console.log('Response Data:', data);
        localStorage.removeItem("loggedIn"); // Clear from localStorage
        localStorage.removeItem("workerID");
        localStorage.removeItem("voted");
      })
      .catch((error) => {
        alert(error.detail);
        localStorage.setItem("loggedIn", JSON.stringify(true));
        localStorage.setItem("workerID", JSON.stringify(this.worker.workerID));
      });
      
    },
    home() {
      this.$router.push("/");
    },
    vote() {
      this.$router.push("/vote");
    }
  },
  watch: {
    // Optional: Sync changes to loggedIn state with localStorage
    loggedIn(newVal) {
      localStorage.setItem("loggedIn", JSON.stringify(newVal));
    },
  },

};