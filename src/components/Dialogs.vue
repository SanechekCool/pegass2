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
					<img id='animation' src="./assets/logo1x.svg" alt="">
			</div>
			<div v-if='show' class='d-flex justify-center flex-column'>
				<h2>Упс! Кажется, что-то пошло не так. Пожалуйста, обновите страницу.</h2><br>
				<img class='align-self-center' src="https://kirovzemlya.ru/wp-content/uploads/2017/04/ios7-sad-icon.png" style='width: 200px; height: 200px;' alt="">
			</div>
			<div v-else>
				<v-flex xs12 v-for='(item, i) in current_dialogs' :key='i'  >
					<div id='card' class='d-flex justify-space-between' @click='start(data[item]["users"][0])'>
						<div class="d-inline-flex">
							<v-avatar size="55" :tile='false' class='mt-2 ml-3'>
								<img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false" >
							</v-avatar>
							<div class='d-flex flex-column ml-4 mt-1'>
								<h3 class='font-weight-thick align-self-start'>{{data[item]["users"][0]}}</h3>
								<div class='d-inline-flex justify-start'>
									<h4 v-if='data[item]["message"]["username"] == personal_name' class='font-weight-bold mt-1'>Вы:&nbsp;</h4>
									<h4 v-if='data' class='font-weight-thin mt-1'>{{data[item]["message"]["text"]}}</h4>
								</div>
								
							</div>
						</div>
						<div class='d-inline-flex mt-1 justify-end mr-1' id='box'>
							<v-badge v-if='data[item]["count"] > 0' left :color="color" small class='mt-8 mr-12'>
								<span slot="badge" class=''>{{data[item]["count"]}}</span>
							</v-badge> 
							<small v-if='data' class='mt-2 mr-3'>{{time(data[item]["message"]["time"])}}</small>
							<v-btn @click='proceedDelete' text small fab class='mt-3'>
								<v-icon>close</v-icon>
							</v-btn>
						</div>
					</div>
					<div class='ml-12'>
						<v-divider class='ml-9' id='divider'></v-divider>
					</div>
					
				</v-flex>
			</div>
			
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
					@click="dialog = false"
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
import { setTimeout } from 'timers';
	export default {
		name: 'Dialogs',
		props: ["socket", "loader"],
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
			// user(){
			// 	return this.$store.state.user
			// },
			dialogs(){
				return this.$store.state.dialogs
			},
			current_dialogs(){
				if (this.dialogs)
					return this.dialogs.filter((a) => a.toLowerCase().indexOf(this.dia_users.toLowerCase()) != -1)
			},
			data(){
				return this.$store.state.data				
			},
			// socket() {
			// 	return this.$root.socket
			// },
			personal_name(){
				return localStorage.username
			}
		},
		methods: {
			time(date){
				let options_today = {
					hour: 'numeric',
					minute: 'numeric',
				}
				let options_past = {
					month: 'long',
					day: 'numeric',
				}
				let m_date = new Date(Date.parse(date + 'Z'))
				if (+(new Date().getDate()) > +(m_date.getDate())) return m_date.toLocaleString('ru', options_past)
				else return m_date.toLocaleString('ru', options_today)
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
			start(username){
				if (!this.delete) {
					this.$emit("start", username)
				}
			},
			
		},
		created() {
			setTimeout(() => {
				if (this.loader == true) {
					this.show = true
				}
			}, 3000)
		}
	}
</script>

<style>
	
	#animation {
		height: 100px;
		width: 100px;
		animation: rotation 1s infinite alternate;
	}
	#card{
		height: 70px;
	}
	#card:hover{
		cursor: pointer;
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
</style>