export default {
    template: `
      <div class="frame">

        <div class="register-page">
          <h2>Register a Worker</h2>
          <form @submit.prevent="submitForm($event)">
            <div class="form-group">
              <label for="workerID">Worker ID:</label>
              <input type="text" id="workerID" v-model="worker.workerID" required />
            </div>
            <div class="form-group">
              <label for="firstName">First Name:</label>
              <input type="text" id="firstName" v-model="worker.firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name:</label>
              <input type="text" id="lastName" v-model="worker.lastName" required />
            </div>
            <div class="form-group">
              <label for="birthdate">Birthdate:</label>
              <input type="date" id="birthdate" v-model="worker.birthdate" required />
            </div>
            <div class="form-group">
              <label for="gender">Gender:</label>
              <select id="gender" v-model="worker.gender" @change="handleGenderChange">
                <option value="" disabled selected>Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="let-me-type">Let me type</option>
                <option value="Prefer-not-to-say">Prefer not to say</option>
              </select>

              <!-- Display text input if 'Let me type' is selected -->
              <div v-if="worker.gender === 'let-me-type'" class="form-group">
                <label for="customGender">Please specify:</label>
                <input 
                  type="text" 
                  id="customGender" 
                  v-model="worker.customGender" 
                  placeholder="Enter your gender" 
                />
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="worker.email" required />
            </div>
    
            <div class="form-group">
              <label for="password">New Password:</label>
              <input
                type="password"
                id="password"
                v-model="worker.password"
                @input="validatePasswordStrength"
                required
              />
              <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
            </div>

            <div class="form-group">
              <label for="re_password">Re-enter Password:</label>
              <input
                type="password"
                id="re_password"
                v-model="worker.re_password"
                @input="validatePasswords"
                required
              />
              <p v-if="passwordMismatch" class="error-text">Passwords do not match!</p>
            </div>
            <button type="submit">Register Worker</button>
            <button type="button" @click="registerAsCandidate">Register as Candidate</button>
          </form>
        </div>

      </div>
    `,
    data() {
      return {
        worker: {
          workerID: '',
          firstName: '',
          lastName: '',
          birthdate: '',
          email: '',
          gender: '',
          customGender: '',
          password: '',
        },
        re_password: '',
        passwordError: "",
        passwordMismatch: false,
        isCandidate: false,
      };
    },

    methods: {
      validatePasswordStrength() {
        const password = this.worker.password;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    
        if (!passwordPattern.test(password)) {
          this.passwordError =
      "Password must be at least 8 characters long, contain an uppercase letter, a number, and a symbol. " +
      "Valid symbols are: @, $, !, %, *, ?, &, .";
        } else {
          this.passwordError = "";
        }
      },
      validatePasswords() {
        // Check if passwords match
        this.passwordMismatch = this.worker.password !== this.worker.re_password;
      },
      registerAsCandidate() {
        this.isCandidate = true; // Set isCandidate to true
        this.submitForm(); // Optionally, call submitForm to handle registration logic
      },
      submitForm() {
        if (this.passwordMismatch) {
          alert("Please fix the password mismatch before submitting.");
          return;
        }
        const apiUrl = "http://127.0.0.1:8000/registerEndpoint/register"; // Backend API URL
        const requestBody = {
          ...this.worker, // Copy all fields from this.worker
          gender: this.worker.gender === "let-me-type" ? this.worker.customGender : this.worker.gender, // Handle custom gender
          isCandidate: this.isCandidate
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
        .then(data => {
          // Handle successful response
          //console.log("Registration successful!", data);
          alert("Registration successful!");
          this.worker = {
            workerID: "",
            firstName: "",
            lastName: "",
            birthdate: "",
            email: "",
            gender: "",
            customGender: "",
            password: "",
          };
          this.re_password = "";
          this.passwordMismatch = false;
          localStorage.removeItem("loggedIn");
        })
        .catch(error => {
          // Handle errors
          console.error("Error code:", error.detail);
  
          if (error.detail === "WORKERID_EXISTS") {
            alert("The WorkerID is already registered!");
          } else {
            alert(`An error occurred: ${error.detail}`);
          }
          location.reload();

        });
      },
      handleGenderChange() {
        if (this.worker.gender !== 'let-me-type') {
          this.worker.customGender = '';  // Clear custom gender input when other options are selected
        }
      },
    }
  };