<template>
	<v-app>
		<Toolbar @changeDrawer='changeDrawer' :color='color' :drawer="drawer" app />
		<v-navigation-drawer
			v-model="drawer"
			app
			temporary
			bottom
    	>
			 <v-list-item>
				<v-list-item-avatar>
					<v-img :src="user.img_url"></v-img>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title>{{personal_name}}</v-list-item-title><br>
					<small class='mt-1' style='color:#5C6BC0; font-size: 12px;'>В сети</small>
				</v-list-item-content>
			</v-list-item>

			<v-divider></v-divider>

			<v-list dense>
				<v-list-item-group v-model="model" :color="color">
					<v-list-item v-for="(item, i) in items" :key='i' >
						<v-list-item-icon>
							<v-icon v-text="item.icon"></v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="item.text"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>


			<template v-slot:append>
				<v-list dense>
					<v-list-item-group >
						<v-list-item @click='logout'> 
							<v-list-item-icon>
								<v-icon v-text="'mdi-exit-to-app'"></v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title >Выйти</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</template>
		 </v-navigation-drawer>


		<v-layout row wrap justify-center class=' mx-0' id='layout'>
			<v-flex lg6 md6 xs12>
				<Dialogs :loader='loader' :socket='socket' @start='start' @loader_off='loaderOff' v-if='model == 2' class='pr-1'  />
				<Friends @startDialog='startDialog'   v-if='model == 1' />
				<Profile v-if='model == 0' />
				<MessagesBox v-if='model == 5' @back='back' :socket='socket' :friend='friend' :new_chat='new_chat'  />
			</v-flex>
		</v-layout>
	</v-app>
</template>

<script>
	import axios from 'axios'
	import Dialogs from './Dialogs.vue'
	import Profile from './Profile.vue'  
	import Friends from './Friends.vue'
	import MessagesBox from './MessagesBox.vue'
	import Toolbar from './Toolbar.vue'
	import {mapState } from 'vuex'

	export default {
		name: 'Main',
		data(){
			return {
				color: "#5C6BC0",
				items: [
					{
						icon: 'mdi-home',
						text: 'Профиль'
					},
					{
						icon: 'mdi-account',
						text: 'Друзья'
					},
					{
						icon: 'mdi-message',
						text: 'Чаты'
					},
					{
						icon: 'mdi-settings',
						text: 'Настройки'
					}
				],
				socket: null,
				friend: {},
				new_chat: false,
				loader: true,
				model: 2,
				drawer: false,
				count: 4
			}
		},
		components: {
			Dialogs, Profile, Friends, MessagesBox, Toolbar
		},
		computed: {
			...mapState(["user"]),
			...mapState(["dialogs"]),
			...mapState(["user"]),
			personal_name() {
				return localStorage.username
			},
			current_room(){
				let names = [this.username, this.personal_name]
				return names.sort().join("_")
			},
		},
		methods: {
			changeDrawer(bool){
				this.drawer = bool
			},
			loaderOff(bool) {
				this.loader = bool
			},
			back(model) {
				this.model = model
			},
			
			start(username){
				this.user.friends.forEach(el => {
					if (username == el.username) this.friend = el
				})
				this.new_chat = false
				this.model = 5
			},
			startDialog(data, user){
				if (this.dialogs.some((a) => a == data.name)) this.start(user.username)
				else this.createRoom(data, user)
			},
			createRoom(data, user){
				axios({
					method: 'post',
					url: this.$store.state.domain + 'api/room',
					data : data
				})
				.then(() => {
					this.$store.commit("newDialog", data["name"])
					this.friend = user
					this.new_chat = true
					this.model = 5
				})
			},
			logout(){
				this.$store.dispatch("LOGOUT")
				.then(() => {
					this.socket.disconnect()
					this.socket.emit('update_last_seen', localStorage.username)
					this.$router.push("/login")
				})
			}
		},
		created(){
			this.socket = io(this.$store.state.domain, {
				'force new connection': true, 
				query: { 
					token: localStorage.token 
				}
			})
			this.socket.on("connect", () => {
				this.socket.emit('initialize', {"username": localStorage.username})
			})

			this.socket.on("disconnect", () => {
				this.socket.emit('update_last_seen', localStorage.username)
				this.$store.commit("logOut")
			})

			this.socket.on("get_messages", (data) => {
				this.loader = false
				this.$store.dispatch("RECIEVE_DATA", data)
			})
			this.socket.on("new_message", (resp) => {
				this.$store.commit("newMessage", resp)
				
			})
			if (localStorage.token == undefined){
				this.$router.push("/login")
			}
			else this.$store.commit("createUser", localStorage.username)
		},
		watch: {
			model(){
				this.drawer = false
			}
		}
	}
</script>

<style>
	#layout {
		margin-top: 20px;
	}
	@media screen and (max-width: 960px) {
		#layout {
			margin-top: 0;
		}
	}
</style>