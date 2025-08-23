export default {
  template: `
    <div>
      <div v-if="loggedIn && !voted" class="frame">
        <h1>Please give your vote:</h1>
        <div class="grid-container">
          <div class="candidate" v-for="(candidate, index) in candidates" :key="index">
            <img :src="candidate.image" :alt="candidate.name" class="candidate-image" />
            <button @click="castVote(index)">Vote for {{ candidate.name }}</button>
          </div>
        </div>
      </div>

      <div v-if= "loggedIn && voted" class="frame">
        <h1>Thank you for voting:</h1>
        <form @submit.prevent="results">
          <button type="submit">Go to results</button>
        </form>
        <form @submit.prevent="home">
          <button type="submit">Go to home</button>
        </form>
      </div>

      <div v-else class="frame">
        <h1>Please log in first</h1>
        <form @submit.prevent="login">
          <button type="submit">Go to log in</button>
        </form>
        <form @submit.prevent="home">
          <button type="submit">Go to home</button>
        </form>
      </div>

    </div>
  `,
  data() {
    return {
      candidates: [
        { name: 'Tom', image: 'images/tom.jpg', voted: false },
        { name: 'Jerry', image: 'images/jerry.jpg', voted: false },
        { name: 'Bugs Bunny', image: 'images/bugsbunny.jpg', voted: false },
        { name: 'Daffy Duck', image: 'images/daffyduck.png', voted: false },
        { name: 'Tweety', image: 'images/tweety.jpg', voted: false },
        { name: 'Popey', image: 'images/popeye.jpg', voted: false },
      ],
      workerID: JSON.parse(localStorage.getItem("workerID")),
      loggedIn: JSON.parse(localStorage.getItem("loggedIn")),
      voted: null,
    };
  },
  created() {
    // Check if the worker has voted when the component is created
    this.canVote().then((canElect) => {
    this.voted = !canElect; // If `canVote` is false, the worker has voted
    });
  },
  methods: {
    castVote(index) {

      const apiUrl = "http://127.0.0.1:8000/electionEndpoint/elect";
      const requestBody = {
        candidateID: index+1,
        workerID: this.workerID,
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
        this.candidates[index].voted = true;
        this.voted = true;
        localStorage.setItem("voted", JSON.stringify(true));
        console.log("ID: ", this.workerID);
        alert(`You voted for: ${this.candidates[index].name}!`);
      })
      .catch((error) => {
        console.error("Caught error:", error);  // Log the error in the console for debugging
        this.candidates[index].voted = false;
        alert(error.message);
      });
    },
    login() {
      this.$router.push("/login");
    },
    home() {
      this.$router.push("/");
    },
    results() {
      this.$router.push("/results");
    },
    async canVote() {
      if (this.workerID == null) {
        return false;
      }
      else {
        const apiUrl = `http://127.0.0.1:8000/electionEndpoint/elect?workerID=${this.workerID}`;
        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          });
          const data = await response.json();
          if (!response.ok) {
            console.log("Error received from backend:", data);
            throw data;
          }
          return data.can_elect; // Assume the backend response includes `can_elect`
        } catch (error) {
            alert(error.detail);
            return false; // Default to `false` in case of error
        }
      }
    },
  },
};


      