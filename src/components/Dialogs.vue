<template>
	<v-card  
	height='800' 
	class="scroll-y"
	id='scroll'
	>
		<div class='ml-1'>
			<h1 class='text-xs-center py-3'>Чаты</h1>
			<v-divider></v-divider>
				<v-flex xs12>
					<v-text-field
					label="Поиск"
					:color='color'
					outlined
					v-model='dia_users'
					prepend-inner-icon="search"
					></v-text-field>
				</v-flex>
			<div v-if='loader' id='cont_anim' class='d-flex justify-center '>
					<img id='animation' src="./assets/logo/logo1x.svg" alt="">
			</div>

			
			<div v-if='show' class='d-flex justify-center flex-column'>
				<h2>Упс! Кажется, что-то пошло не так. Пожалуйста, обновите страницу.</h2><br>
				<img class='align-self-center' src="https://kirovzemlya.ru/wp-content/uploads/2017/04/ios7-sad-icon.png" style='width: 200px; height: 200px;' alt="">
			</div>


			<v-flex xs12 v-for='(item, i) in data' :key='i'  >
				<div id='card'  class='d-flex justify-space-between' @click='start(item)'>
					<div class="d-inline-flex">
						<v-avatar size="55" :tile='false' class='mt-2 ml-3'>
							<img :src="item.photo_url" >
						</v-avatar>
						<div class='d-flex flex-column ml-4 mt-1'>
							<h3 class='font-weight-thick align-self-start'>{{item.username}}</h3>
							<div class='d-inline-flex justify-start text-wrap'>
								<v-avatar v-if='item.lastMessage.user.username == personal_name' size="27" :tile='false' class='mr-2 mt-1'>
									<img :src="user.photoURL" >
								</v-avatar>
								<!-- <h4  class='font-weight-bold mt-1'>Вы:</h4> -->
								<h4 v-if='data' id='h1' class='font-weight-thin mt-2'>{{item.lastMessage.text}}</h4>
							</div>
						</div>
					</div>
					<div class='d-inline-flex mt-1 justify-end mr-1' id='box'>
						<!-- <v-badge v-if='data[item]["count"] > 0' left :color="color" small class='mt-8 mr-12'>
							<span slot="badge" class=''>{{data[item]["count"]}}</span>
						</v-badge>  -->
						<small v-if='data' class='mt-2 mr-3'>{{time(item.lastMessage.time)}}</small>
						<v-btn @click='proceedDelete' text small fab class='mt-3'>
							<v-icon>close</v-icon>
						</v-btn>
					</div>
				</div>
				<div class='ml-12'>
					<v-divider class='ml-9' id='divider'></v-divider>
				</div>
			</v-flex>

			<!-- Другой вариант -->

			<!-- <v-list v-else subheader >
				<v-list-item
				v-for="(item, i) in data"
				:key="i"
				@click="start(item)"
				>
					<v-list-item-avatar :size='55'>
						<v-img :src="item.photo_url"></v-img>
					</v-list-item-avatar>

					<v-list-item-content >
						<v-list-item-title class='text-left font-weight-bold' v-text="item.username"></v-list-item-title>
						<p class='text-left pt-2'>{{item.message.text}}</p>
					</v-list-item-content>

					<v-list-item-icon >
						<small class='mr-4 mt-3'>{{time(item.message.time)}}</small>
						<v-btn class='mt-4' text icon @click='proceedDelete'>
							<v-icon :color="color">close</v-icon>
						</v-btn>
					</v-list-item-icon><br>
					<div class='ml-12' >
						<v-divider class='ml-12' ></v-divider>
					</div>
				</v-list-item> 
				
			</v-list> -->
					
			
			<v-dialog
			v-model="dialog"
			max-width="290"
			>
				<v-card>
					<v-card-title class="headline">Вы уверены, что хотите удалить историю сообщений?</v-card-title>
					<v-card-text>
						Данное действие невозможно будет отменить
					</v-card-text>
					<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="error"
						text="text"
						@click="stopDeleting"
					>
						Нет
					</v-btn>
					<v-btn
						:color="color"
						text="text"
						@click="deleteRoom(item[0])"
					>
						Да
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</v-card>
</template>

<script>
	import axios from 'axios'
	import { setTimeout } from 'timers'
	import { mapState } from 'vuex'

	export default {
		name: 'Dialogs',
		props: ["socket"],
		data(){
			return{
				text: '',
				flag: true,
				username: '',
				show: false,
				dia_users: '',
				delete: false,
				color: "#5C6BC0",
				dialog: false,
			}
		},
		
		computed: {
			...mapState(["user"]),
			loader(){
				return this.$store.state.loader
			},
			
			current_dialogs(){
				if (this.data)
					return this.data.filter((a) => a.username.toLowerCase().indexOf(this.dia_users.toLowerCase()) != -1)
			},
			data(){
				return this.$store.state.data				
			},
			// socket() {
			// 	return this.$root.socket
			// },
			personal_name(){
				return this.$store.state.user.displayName
			}
		},
		methods: {
			stopDeleting(){
				this.dialog = false
				this.delete = false
			},
			time(date){
				let options = {
					hour: 'numeric',
					minute: 'numeric',
				}
				
				let m_date = new Date(date.seconds * 1000)
				return m_date.toLocaleString("ru", options)
			},
			proceedDelete(){
				this.delete = true
				this.dialog = true
				
			},
			deleteRoom(name){
				axios({
					method: 'delete',
					url: "https://fastapi-chat.herokuapp.com/rooms/" + name
				})
			},
			start(user){
				if (!this.delete) this.$emit("startDialog", user)
				
			},
			
		},
		created() {
			setTimeout(() => {
				if (this.loader == true) {
					this.$emit("loader_off", false)
					this.show = true
				}
			}, 15000)
		}
	}
</script>

<style>
	#scroll {
		height: 100%;
	}
	#h1 {
		width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}
	#animation {
		height: 90px;
		width: 90px;
		animation: rotation .75s infinite alternate;
	}
	#card{
		height: 70px;
	}
	#card:hover{
		cursor: pointer;
		background-color: #E8EAF6;
	}
	.active {
		background-color: #E8EAF6;
	}
	
	@keyframes rotation {
		0% {
        	transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media screen and (max-width: 1265px) {
		#divider{
			margin-left: 108px;
		}
		
	}
	@media screen and (max-width: 530px){
		#h1 {
			width: 100px;
			
		}
	}
</style>