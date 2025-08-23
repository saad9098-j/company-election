export default {
    template: `
      <div>
        <div v-if="loggedIn" class="frame">
          <h1>Results:</h1>
          <div class="grid-container">
            <div class="candidate" v-for="(candidate, index) in candidatesimages" :key="index">
              <img :src="candidate.image" :alt="candidate.name" class="candidate-image" />
              <p>{{ candidate.votes }} votes</p>
            </div>
          </div>
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
        candidatesimages: [
          { name: 'Tom Cat', image: 'images/tom.jpg', votes: 0 },
          { name: 'Jerry Mouse', image: 'images/jerry.jpg', votes: 0 },
          { name: 'Bugs Bunny', image: 'images/bugsbunny.jpg', votes: 0 },
          { name: 'Daffy Duck', image: 'images/daffyduck.png', votes: 0 },
          { name: 'Tweety Bird', image: 'images/tweety.jpg', votes: 0 },
          { name: 'Popey Sailor', image: 'images/popeye.jpg', votes: 0 },
        ],
        candidates: [], // Initially empty, will be populated by fetchCandidates
        loggedIn : localStorage.getItem("loggedIn"),
      };
    },
    methods: {
      async fetchVotes() {
        try {
          const response = await fetch("http://127.0.0.1:8000/electionEndpoint/candidates");
          if (!response.ok) {
            const error = await response.json();
            throw error;
          }
  
          const data = await response.json();
          const votesFromBackend = data.candidates;
          // Update votes in the static candidate list
          this.candidatesimages.forEach(candidate => {
            const matchedCandidate = votesFromBackend.find(
              backendCandidate => `${backendCandidate.firstName} ${backendCandidate.lastName}` === candidate.name
            );
            if (matchedCandidate) {
              candidate.votes = matchedCandidate.votes;
            }
          });
        } catch (error) {
          console.error("Error fetching votes:", error.detail);
        }
      },
      login() {
        this.$router.push("/login");
      },
      home() {
        this.$router.push("/");
      }
    },
    mounted() {
      // Fetch the votes when the component is mounted
      this.fetchVotes();
    },

};