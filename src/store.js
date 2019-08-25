import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {},
		dialogs: [],
		data: {},
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
			state.user = {}
			state.token = null
			state.data = {}
			state.dialogs = []
		},
		retrieveToken(state, token){
			state.token = token
		},
		retrieveUsername(state, username) {
			state.user.name = username
		},
		addMessage(state, message){
			state.messages[message.room_name].push(message)
		},
		retrieveData(state, data){
			state.data = data
			state.dialogs = Object.keys(data)
		},
		// createUser(state, token){
		// 	axios({
	  	// 		method: 'get',
	  	// 		url: 'https://fastapi-chat.herokuapp.com/test',
	  	// 		headers: {
	  	// 			'Authorization': 'Bearer ' + localStorage.token
	  	// 		}
	  	// 	})
	  	// 	.then((resp) => {	
	  	// 		state.user = {
	  	// 			rooms: resp.data.group_list,
	  	// 			name: resp.data.username,
	  	// 			email: resp.data.email
	  	// 		}
	  	// 		localStorage.username = resp.data.username
	  	// 		let dia = []
		// 		state.user.rooms.forEach((el, i) => {
		// 			dia[i] = [el]
		// 		})
		// 		dia.forEach((el,i) => {
		// 			let element = el[0].split("_")
		// 			if (element[0] == state.user.name) dia[i].push(element[1])
		// 			else dia[i].push(element[0])
		// 		})
		// 		state.dialogs = dia
	  	// 	})
		// }
	},
	actions: {
		// retrieveToken(context, credentials) {
		// 	return new Promise((resolve, reject) => {
		// 		axios.post('https://fastapi-chat.herokuapp.com/token', credentials, {
		// 			"Authorization": "Basic",
		// 			"Content-Type": 'application/x-www-form-urlencoded'
		// 		})
		// 		.then( (response) => {
		// 			localStorage.token = response.data.access_token
		// 			context.commit('retrieveToken', response.data.access_token)
		// 			context.commit('createUser', response.data.access_token)
		// 			resolve(response)
		// 		})
		// 		.catch((error) => {
		// 			reject(error)
		// 		})
		// 	})
		// },
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
