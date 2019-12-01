import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
console.log(axios)

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    todos: []
  },

  getters: {
    allTodos: (state) => state.todos
  },


  actions: {  //make a request, get a response and then call a mutation that is what actually mutates the state. We don' call mutation directly, we call it with "commit" passe in fetchTodos
    async fetchTodos({ commit }) {
      console.log(commit)
      const response  = await axios.get('https://jsonplaceholder.typicode.com/todos');
      commit('setTodos', response.data) //in order to call the mutation, we need to use commit. The first argument is setTodos in mutations and the second argument is the second parameter passed in mutations
    },

    async addTodo({ commit }, title) { //it takes an object that we're going to destructure with commit and it's going to be passed in a title and we're going to make a POST request to jsnplaceholder to 
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', { title, completed: false });

      commit('newTodo', response.data); //call the mutation newTodo and pass the response.data that includes the newTodo
    },

    async deleteTodo({ commit }, id) {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

      commit('removeTodo', id);
    },

    async filterTodos({ commit }, e) {
      console.log(e, commit);
      //Get selected number
      const limit = parseInt(e.target.options[e.target.options.selectedIndex].innerText);

      const response  = await axios.get(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`);

      commit('setTodos', response.data);
    },

    async updateTodo({ commit }, updTodo) {
      const response  = await axios.put(`https://jsonplaceholder.typicode.com/todos/${updTodo.id}`, updTodo);
      console.log(response.data)

      commit('updateTodo', response.data);
    }
  },

  mutations: { //takes the array from the response and adds it to the state
    setTodos: (state, todos) => state.todos = todos,
    newTodo: (state, todo) => state.todos.unshift(todo), //unshift puts the new element at the beginning
    removeTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id !== id), //it will remove it from the UI
    updateTodo: (state, updTodo) => {
      const index = state.todos.findIndex(todo => todo.id === updTodo.id); //give me the index of the todo that I want to replace
      if (index !== -1) {
        state.todos.splice(index, 1, updTodo);
      }
    }
  },

  modules: {
  }
})
