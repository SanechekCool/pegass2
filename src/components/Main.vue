<template>
	<v-app>
		<Toolbar @changeDrawer='changeDrawer' @changeLocation='changeLocation' :color='color' :drawer="drawer" app />
		<v-navigation-drawer
			v-model="drawer"
			app
			temporary
			bottom
    	>
			 <v-list-item>
				<v-list-item-avatar>
					<v-img :src="user.photoURL"></v-img>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title>{{user.displayName}}</v-list-item-title><br>
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
				<Dialogs   @startDialog='startDialog' @loader_off='loaderOff' v-if='model == 2' class='pr-1'  />
				<Friends @startDialog='startDialog'   v-if='model == 1' />
				<Profile v-if='model == 0' :color='color' @changeLocation='changeLocation' />
				<MessagesBox v-if='model == 5' @back='back' @messageSent='messageSent' :roomName='roomName' :friend='friend' :new_chat='new_chat'  />
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
	import {auth, firestore} from '../firebase.js'


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
				friend: {},
				new_chat: false,
				roomName: null,
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
			...mapState(["data"]),
			...mapState(["user"]),
		},
		methods: {
			messageSent(bool){
				this.new_chat = bool
			},
			changeDrawer(bool){
				this.drawer = bool
			},
			loaderOff(bool) {
				this.loader = bool
			},
			back(model) {
				this.model = model
			},
			
			start(friend, name, bool){
				this.friend = {
					"username": friend.username,
					"photo_url": friend.photoUrl,
					// "last_seen": friend.last_seen
				}
				this.roomName = name
				this.new_chat = bool
				this.model = 5
			},
			startDialog(user){
				this.new_chat = false
				let names = user.room
				let bool = !this.data.some((a) => a.username == user.username)

				this.start(user, names, bool)
			},
			changeLocation(loc){
				this.model = loc
			},
			
			logout(){
				this.$store.dispatch("LOGOUT")
				.then(() => {
					this.$router.push("/login")
				})
			}
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