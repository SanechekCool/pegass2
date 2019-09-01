<template>
	<div>
		<v-card class='d-flex justify-space-between' height='62' color='#BDBDBD' dark>
			<v-btn text large @click='back' class='mt-2'>
				<v-icon>
					arrow_back
				</v-icon>
				Чаты
			</v-btn>
			<div class='d-flex flex-column mr-5 mt-1'>
				<h2>{{username}}</h2>
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
			<div v-if='loading' id='cont_anim' class='d-flex justify-center '>
					<img id='animation' src="./assets/logo1x.svg" alt="">
			</div>
			<div v-else  >
				<Message v-for='(item, i) in messages' :key='i' 
				  :i='i' :id='item.id'
				  :timestamp='item.time' :text='item.text' 
				  :owner="item.username === personal_name" :color='color'
				  @deleteMessage='deleteMessage' 
				/>
			</div>
			<div v-if='flag' id='scrollBot'>
				<v-btn @click='scroll' class='ml-2'>Вниз</v-btn>
			</div>
		</v-card>
		<MessageField :username='username' :socket='socket' />
		
	</div>
</template>

<script>
	import axios from 'axios'
	import { setTimeout } from 'timers';
	import { mapState } from 'vuex'
	import Message from './Message.vue'
	import MessageField from './MessageField.vue'

	export default {
		name: 'MessagesBox',
		props: ['username', "socket"],
		data(){
			return {
				color: "#5C6BC0",
				message: '',
				loading: true,
				flag: false,
				show: false,
			}
		},
		components: { Message, MessageField},
		computed: {
			...mapState(["user"]),
			...mapState(["messages"]),
			current_room(){
				let names = [this.username, this.personal_name]
				return names.sort().join("_")
			},
			personal_name(){
				return localStorage.username
			},
			
			
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
						this.$store.state.data[this.current_room]["message"]["text"] = this.messages[this.messages.length - 1].text
					}
				})
			},
			scroll(){
				const container = document.querySelector("#scroll-target")
				container.scrollTop = container.scrollHeight
				
			},
			
		},
		mounted(){
			const container = document.querySelector("#scroll-target")
			container.addEventListener("scroll", (event) => {
				if (Math.abs(container.scrollTop - container.scrollHeight) >= 1000) {
					this.flag = true
				}
				else this.flag = false
			})
		},
		created(){
			this.socket.emit("view", {"username": localStorage.username, "room": this.current_room})
			this.$store.state.data[this.current_room]["count"] = 0
			this.socket.once("room_messages", (response) => {
				this.$store.commit("getMessages", response)
				this.loading = false
			})
			
		},
		watch: {
			messages(){
				setTimeout(() => {
					this.scroll()
				}, 0)
			}
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
	#scrollBot {
		position: fixed;
		bottom: 270px;
	}
	
</style>