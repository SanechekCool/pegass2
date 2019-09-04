<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			absolute
			bottom
    	>
			 <v-list-item>
				<v-list-item-avatar>
					<!-- <v-img :src="user.img_url"></v-img> -->
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title>{{personal_name}}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-divider></v-divider>

			<v-list dense>
				<v-list-item-group v-model="model" :color="color">
					<v-list-item v-for="(item, i) in items" :key='i'>
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
					<v-list-item-group>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title @click='logout'>Выйти</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</template>
		 </v-navigation-drawer>


		<v-layout row wrap justify-center class='mt-10'>
			<v-flex lg6 md6 xs12>
				<Dialogs :loader='loader' :socket='socket' @start='start' @loader_off='loaderOff' v-if='model == 2' />
				<Friends @startDialog='startDialog' v-if='model == 1' />
				<Profile v-if='model == 0' />
				<MessagesBox v-if='model == 5' @back='back' :socket='socket' :username='username' :new_chat='new_chat' />
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
				username: '',
				new_chat: false,
				loader: true,
				model: 2,
				drawer: true,
				count: 4
			}
		},
		components: {
			Dialogs, Profile, Friends, MessagesBox
		},
		computed: {
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
			loaderOff(bool) {
				this.loader = bool
			},
			back(model) {
				this.model = model
			},
			start(username){
				this.username = username
				this.new_chat = false
				this.model = 5
			},
			startDialog(data, username){
				axios({
					method: 'post',
					url: this.$store.state.domain + 'api/room',
					data : data
				})
				.then(() => {
					this.$store.commit("newDialog", data["name"])
					this.username = username
					this.new_chat = true
					this.model = 5
				})
			},
			logout(){
				this.$store.dispatch("LOGOUT")
				.then(() => {
					this.$router.push("/login")
				})
			}
		},
		created(){
			this.socket = io(this.$store.state.domain, { 
				query: { 
					token: localStorage.token 
				}
			})
			this.socket.on("connect", () => {
				this.socket.emit('initialize', {"username": localStorage.username})
			})
			this.socket.on("get_messages", (data) => {
				this.loader = false
				this.$store.dispatch("RECIEVE_DATA", data)
			})
			this.socket.on("new_message", (resp) => {
				this.$store.commit("newMessage", resp)
				
			})
			if (localStorage.username == undefined){
				this.$router.push("/login")
			}
			else this.$store.commit("createUser", localStorage.username)
		}
	}
</script>

<style>
</style>