<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			absolute
			bottom
    	>
			 <v-list-item>
				<v-list-item-avatar>
					<v-img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false"></v-img>
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
				<Dialogs :socket='socket' @start='start' v-if='model == 2' />
				<Search @startDialog='startDialog' v-if='model == 1' />
				<Profile v-if='model == 0' />
				<MessagesBox v-if='model == 5' @back='back' :socket='socket' :username='username' />
			</v-flex>
		</v-layout>
	</v-app>
</template>

<script>
	import axios from 'axios'
	import Dialogs from './Dialogs.vue'
	import Profile from './Profile.vue'  
	import Search from './Search.vue'
	import MessagesBox from './MessagesBox.vue'

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
				model: 2,
				drawer: true,
				count: 4
			}
		},
		components: {
			Dialogs, Profile, Search, MessagesBox
		},
		computed: {
			personal_name() {
				return localStorage.username
			}
		},
		methods: {
			back(model) {
				this.model = model
			},
			start(username){
				this.username = username
				this.model = 5
			},
			startDialog(data){
				axios({
					method: 'post',
					url: this.$store.state.domain + 'api/room',
					data : data
				})
				.then(() => {
					this.$store.state.dialogs.push(this.foundUser.username)
					this.model = 5
					this.username = this.foundUser.username
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
			this.socket = io(this.$store.state.domain)
			this.socket.on("connect", () => {
				this.socket.emit('initialize', {"username": localStorage.username})
			})
			this.socket.on("get_messages", (data) => {
				this.$store.dispatch("RECIEVE_DATA", data)
			})
			this.socket.on("new_message", (resp) => {
				this.$store.state.data[resp.roomname]["message"] = resp
				this.$store.state.data[resp.roomname]["count"] += 1
			})
			if (localStorage.username == ''){
				this.$router.push("/login")
			}
			else this.$store.commit("retrieveUsername", localStorage.username)
		}
	}
</script>

<style>
</style>