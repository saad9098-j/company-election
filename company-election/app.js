import Home from './components/home.js';
import Register from './components/register.js';
import Vote from './components/vote.js';
import Results from './components/results.js';
import Login from './components/login.js';


const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/vote', component: Vote },
  { path: '/results', component: Results },
  { path: '/login', component: Login },
];

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router
});