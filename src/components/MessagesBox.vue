<template>
	<div>
		<v-card class='d-flex justify-space-between' height='60' color='#BDBDBD' dark>
			<v-btn text large @click='back' class='mt-2'>
				<v-icon>
					arrow_back
				</v-icon>
				Назад
			</v-btn>
			<div class='d-flex flex-column'>
				<h2 >{{username}}</h2>
				<small style='color: #5C6BC0'>online</small>
			</div>
			<v-avatar :size="53" :tile='true' class='mt-1 mr-1'>
				<img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false" alt="">
			</v-avatar>
		</v-card>
		<v-card  
		height='600' 
		class="scroll-y"
		id='scroll-target'
		>
			<div v-for='(item,i) in messages' :key='i' class='px-1'>
				<div v-if='item.username == personal_name' class='d-flex justify-end my-1'>
					<v-chip @click='deleteMessage(item.id, i)' :color="color" text-color="white"  >
						<h4>{{item.text}}</h4>
						<small class='pt-3 pl-2'>{{time(item.time)}}</small>
					</v-chip>
				</div>
				<div v-else class='d-flex justify-start my-1'>
					<v-chip :color="color" :text-color="color" outlined >
						<v-avatar>
							<img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false">
						</v-avatar>
						<h4 class='ml-1'>{{item.text}}</h4>
						<small class='pt-3 ml-2'>{{time(item.time)}}</small>
					</v-chip>
				</div>
			</div>
		</v-card>
		
		<div id="text">
			<v-text-field
			class='pt-4 px-2'
			label='Напишите сообщение' 
			solo
			color='#000'
			v-model='message'
			@keyup.enter='sendMessage' 
			:append-outer-icon="'send'"
			@click:append-outer="sendMessage"></v-text-field>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import { setTimeout } from 'timers';
	export default {
		name: 'MessagesBox',
		props: ['username', "socket"],
		data(){
			return {
				color: "#5C6BC0",
				message: '',
				flag: false,
				show: false,
				messages: [],
			}
		},
		computed: {
			user(){
				return this.$store.state.user
			},
			current_room(){
				let names = [this.username, this.personal_name]
				return names.sort().join("_")
			},
			personal_name(){
				return localStorage.username
			},
			// username(){
			// 	return this.$route.params.username
			// },
			
		},
		methods:{
			back(){
				this.$emit("back", 2)
			},
			deleteMessage(id, i){
				axios({
					method: 'delete',
					url: this.$store.state.domain + 'api/message/' + id,
				})
				.then((response) => {
					console.log("Done")
					if (response.status == 200) {
						this.messages.splice(i, 1)
					}
				})
			},
			time(date){
				let m_date = new Date(Date.parse(date + 'Z'))
				if (+new Date(m_date).getMinutes() > 9) {
					return (+new Date(m_date).getHours()).toString() + ":"  + new Date(m_date).getMinutes()
				}
				else {
					return (+new Date(m_date).getHours()).toString()  + ":0"  + new Date(m_date).getMinutes()
				} 
			},
			scroll(){
				const container = document.querySelector("#scroll-target")
				container.scrollTop = container.scrollHeight
				
			},
			sendMessage(){
				this.socket.emit("send_message", {"room": this.current_room, "username": localStorage.username, "text": this.message})
				this.message = ''
			}
		},
		updated() {
			this.scroll()
		},
		created(){
			this.socket.emit("view", {"username": localStorage.username, "room": this.current_room})
			this.$store.state.data[this.current_room]["count"] = 0
			this.socket.on("room_messages", (response) => {
				this.messages = response
			})
			this.socket.on("new_message", (resp) => {
				if (resp.roomname == this.current_room) {
					this.messages.push(resp)
				}
			})
		}
		
	}
</script>

<style>
	#message:hover {
		cursor: pointer;
	}
	#scrollBot{
		cursor: pointer;
		border-radius: 15px;
		position: fixed;
		bottom: 160px;
	}
	#scroll-target {
		overflow-y: scroll;
	}
	#scroll-target::-webkit-scrollbar{
		width: 0;
	}
	#text{
		background-color: #BDBDBD;
		position: relative;
	}
</style>