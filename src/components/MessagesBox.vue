<template>
	<div>
		<v-dialog
        v-model="dialog"
        max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Нельзя удалять чужие сообщения!</v-card-title>
                <v-btn
                    :color="color"
                    text="text"
                    @click="dialog = false"
					class='mb-2'
                >
                    Закрыть
                </v-btn>
            </v-card>
        </v-dialog>



		<v-card class='d-flex justify-space-between' height='62' color='#BDBDBD' dark>
			<v-btn text large @click='back' class='mt-2'>
				<v-icon>
					arrow_back
				</v-icon>
				Чаты
			</v-btn>
			<div class='d-flex flex-column mr-5 mt-1'>
				<h2>{{friend.username}}</h2>
				<small v-if='friend.last_seen != "В сети"' style='color: #5C6BC0'>Был в сети {{time(friend.last_seen)}}</small>
				<small v-else style='color: #5C6BC0'>{{friend.last_seen}}</small>
			</div>
			<v-avatar  class='mt-1 mr-1'>
				<img :src="friend.photo_url" alt="">
			</v-avatar>
		</v-card>
		<v-card  
		height='600' 
		class="scroll-y"
		id='scroll-target'
		>
			<div v-if='loading' id='cont_anim' class='d-flex justify-center '>
					<img id='animation' src="./assets/logo/logo1x.svg" alt="">
			</div>
			<div v-else  >
				<Message v-for='(item, i) in messages' :key='i' 
				   :src='friend.photo_url'
				  :id='item.id'
				  :timestamp='item.time' :text='item.text' 
				  :owner="item.user.username === user.displayName" :color='color'
				  @deleteMessage='deleteMessage'
				  @deleteAlert='deleteAlert' 
				/>
			</div>
			<div v-if='flag' id='scrollBot'>
				<v-btn @click='scroll' class='ml-2'>Вниз</v-btn>
			</div>
		</v-card>
		<MessageField :friend='friend' :roomName='roomName' :user='user'  :color='color' />
		
	</div>
</template>

<script>
	import axios from 'axios'
	import { setTimeout } from 'timers';
	import { mapState } from 'vuex'
	import Message from './Message.vue'
	import MessageField from './MessageField.vue'
	import {firestore, dialogsRef} from '../firebase.js'

	export default {
		name: 'MessagesBox',
		props: ['friend', "new_chat", "roomName"],
		data(){
			return {
				color: "#5C6BC0",
				message: '',
				loading: true,
				flag: false,
				dialog: false,
				show: false,
			}
		},
		components: { Message, MessageField},
		computed: {
			...mapState(["user"]),
			...mapState(["messages"]),
			
			personal_name(){
				return this.user.displayName
			},
		},
		methods:{
			back(){
				this.$emit("back", 2)
			},
			deleteAlert(){
				this.dialog = true
			},
			deleteMessage(id){
				dialogsRef.doc(this.roomName).collection("messages").doc(id).delete()
			},
			scroll(){
				const container = document.querySelector("#scroll-target")
				container.scrollTop = container.scrollHeight
				
			},
			time(date){
				let options = {
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				}
				
				let m_date = new Date(Date.parse(date))
				return m_date.toLocaleString('ru', options)
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
			if (this.new_chat) {
				firestore.collection("users").doc(this.user.uid).collection("dialogs").doc(this.roomName).set({})
				this.$emit("messageSent", false)
			}

			firestore.collection("dialogs").doc(this.roomName).collection("messages").orderBy("time")
			.onSnapshot((querySnapshot) => {
				let messages = []
				let index = 0
				querySnapshot.forEach((doc) => {
					messages.push(doc.data())
					messages[index].id = doc.id
					index++
				})
				this.loading = false
				this.$store.commit("getMessages", messages)
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