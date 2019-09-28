import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import {auth, firestore} from './firebase.js'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	data(){
		return {
			loader: true
		}
	},
	computed:{
		user(){
			return auth.currentUser
		}
	},
  	mounted(){
    	auth.onAuthStateChanged(function(user) {
			if (user) {
				store.dispatch("RETRIEVE_CREDENTIALS", user)
				.then(() => {
					
					this.loader = false
				}) 
			}
			else {
				store.dispatch("LOGOUT")
			}
		
    	})
 	},
  	render: h => h(App)
}).$mount('#app')
