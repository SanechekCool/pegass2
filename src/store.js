import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {auth, usersRef, dialogsRef, firestore} from './firebase.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {},
		dialogs: [],
		loader: true,
		data: [],
		messages: [],
		domain: 'https://flask-io-chat.herokuapp.com/',
	},
	getters: {
		loggedIn(state){
			return localStorage.uid != ''
		},
	},
	
	mutations: {
		logOut(state){
			usersRef.doc(state.user.uid).update({
				"last_seen": (new Date()).toString()
			})
			localStorage.removeItem("uid")
			state.data = []
			auth.signOut()
		},
		retrieveUsername(state, username) {
			state.user.name = username
		},
		addFriend(state, user){
			state.user.friends.push(user)
		},
		
		newDialog(state, roomname){
			state.dialogs.push(roomname)
		},
		getMessages(state, messages){
			state.messages = messages
		},
		newMessage(state, [room, message]){
			state.data.forEach((el, i) => {
				if (el.room == room) {
					state.data[i] = message
					return false
				}
			})
			
		},
		createUser(state, [user, data]){
			state.data = []
			state.user = user
			state.data = data
			localStorage.email = user.email
			
			data.forEach(el => {
				state.dialogs.push(el.username)
			})
			state.loader = false
			usersRef.doc(user.uid).update({
				"last_seen": "В сети"
			})
		}
	},
	actions: {
		PUBLISH_POST(context, data){
			usersRef.child(localStorage.uid).child("posts").push(data)
		},
		RETRIEVE_CREDENTIALS(context, user){
			return new Promise((resolve, reject) => {
				let idsFriends = []
				let data = []
				let idsDialogs= []
				let friends = []
				let final_user = user
				let dialogs = []

				//get Data
				usersRef.doc(auth.currentUser.uid).collection("dialogs").get() 
				.then((doc) => {
					doc.docs.forEach((el) => {
						idsDialogs.push(el.id)
					})
					
					idsDialogs.forEach((elem, i) => {
						usersRef.doc(auth.currentUser.uid).collection("dialogs").doc(elem)
						.get()
						.then((querySnapshot) => {
							let e = querySnapshot.data()
							e.room = elem
							data.push(e)
						})
						
					})
				})

				//get Friends
				usersRef.doc(auth.currentUser.uid).collection("friends").get()
				.then((document) => {
					document.docs.forEach((el) => {
						idsFriends.push(el.id)
					})
					idsFriends.forEach((elem, i) => {
						usersRef.doc(elem).get()
						.then((querySnapshot) => {
							friends.push(querySnapshot.data())
							friends[i].id = elem
						})
					})
				})
				final_user["friends"] = friends
				context.commit("createUser", [final_user, data])
				resolve()
			})
		},
		SIGN_UP(context, data) {
			return new Promise((resolve, reject) => {
				auth.createUserWithEmailAndPassword(data.email, data.password)
				.then((response) => {
					auth.currentUser.updateProfile({
						displayName: data.username,
						  photoURL: data.photo_url,
						  email: data.email
					})
					let real_data = {
						"username": data.username,
						"email": data.email,
						"photo_url": data.photo_url,
						"last_seen": "В сети"
					}
					localStorage.uid = auth.currentUser.uid
					firestore.runTransaction(function(transaction) {
						usersRef.doc(auth.currentUser.uid).set(real_data)
					})
					.then(() => {
						resolve()
					})
					.catch((err) => {
						reject(err)
					})
				})
                .catch((error) => {
					reject(error)
                })		
				
			})
				
		},
		ADD_FRIEND(context, user){
			usersRef.doc(auth.currentUser.uid).collection("friends").doc(user.id).set({})
			context.commit("addFriend", user)
		},
		LOG_IN(context, credentials){
			return new Promise((resolve, reject) => {
				auth.signInWithEmailAndPassword(credentials.email, credentials.password)
				.then(() => {
					
					resolve()
				})
				.catch((err) => {
					reject(err)
				})
				
			})
		},
		RECIEVE_DATA(context, [dialogs, messages]){
		
			
		},
		LOGOUT(context){
			context.commit("logOut")
		}
	}	
})
