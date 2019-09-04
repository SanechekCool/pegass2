import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {},
		dialogs: [],
		data: {},
		messages: [],
		domain: 'https://flask-io-chat.herokuapp.com/',
	  	token: localStorage.token || null
	},
	getters: {
		loggedIn(state){
			return localStorage.username != ''
		},
	},
	mutations: {
		logOut(state){
			localStorage.token = undefined
		},
		retrieveUsername(state, username) {
			state.user.name = username
		},
		retrieveData(state, data){
			state.data = data
			state.dialogs = Object.keys(data)
		},
		newDialog(state, roomname){
			state.dialogs.push(roomname)
		},
		getMessages(state, messages){
			state.messages = messages
		},
		newMessage(state, message){
			state.messages.push(message)
			state.data[message.roomname]["message"] = message
			if (message.username != state.user.name) state.data[message.roomname]["count"] += 1 
			
		},
		createUser(state, token){
			axios({
	  			method: 'get',
				  url: state.domain + 'api/user/' + localStorage.username,
				  headers: {
					  'Authorization': 'Bearer ' + token
				  }
	  		})
	  		.then((resp) => {
	  			state.user = {
					name: resp.data.username,
					email: resp.data.email,
					img_url: resp.data.photo_url
	  			}
	  		})
		}
	},
	actions: {
		
		SIGN_UP(context, credentials) {
			return new Promise((resolve, reject) => {
					axios({
						method: 'post',
						url: context.state.domain + 'api/user',
						data: credentials,
					})
					.then( (response) => {
						localStorage.username = credentials["username"],
						resolve(credentials)
						localStorage.token = response.data.token
						context.commit('createUser', response.data.token)
					})
					.catch((error) => {
						reject(error)
					})
				
			})
				
		},
		LOG_IN(context, credentials){
			return new Promise((resolve, reject) => {
				axios({
					method: 'post',
					url: context.state.domain + 'api/login', 
					data: credentials,
				})
				.then((response) => {
					
					resolve(credentials)
					localStorage.username = credentials["username"],
					localStorage.token = response.data.token
					context.commit('createUser', response.data.token)
				})
				.catch((err) => {
					reject(err)
				})
			})
		},
		RECIEVE_DATA(context, data){
			context.commit("retrieveData", data)
		},
		LOGOUT(context){
			localStorage.token = ''
			localStorage.username = ''
			context.commit("logOut")
		}
	}	
})
