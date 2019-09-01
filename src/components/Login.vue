<template>
	<v-container>
        <div class='d-flex  justify-center' id='title'>
			<h1 class='display-4 align-self-center' >Welcome to Pegass</h1>
		</div>
		<div class='d-flex justify-center' id='main'> 
			<v-flex lg8>
				<v-card class="elevation-2">
					<v-toolbar dark :color="color" class='mb-2'>
						<v-toolbar-title>Введите имя пользователя и пароль</v-toolbar-title>
					</v-toolbar>
					<v-text-field class='px-2'  label="Имя пользователя" :color='color' v-model='username' type="text"></v-text-field>
					<v-text-field class='px-2' label="Пароль" @keyup.enter='send' v-model='password' :color='color' type="password"></v-text-field>
					<v-card-actions>
						<v-spacer></v-spacer>
						<small class='mr-4'>Не зарегестрированы?&nbsp; <router-link to='/register'>Создать аккаунт</router-link></small>
						<v-btn :color="color" @click='send' dark>Войти</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
			<v-overlay :value="overlay">
				<div id='cont_anim' class='d-flex justify-center '>
					<img id='animation' src="./assets/logo1x.svg" alt="">
				</div>
			</v-overlay>
		</div>
	</v-container>
</template>

<script>
	import axios from 'axios'
	export default {
		name: "Login",
		data() {
			return {
				step: 1,
				color: "#5C6BC0",
				username: '',
				overlay: false,
				email: '',
				password: '',
			}
		},
		methods: {
			send(){
				this.overlay = true
				this.$store.dispatch("LOG_IN", {"username": this.username, "password": this.password})
				.then(()=> {
					this.$router.push("/")
				})
				.catch((err) => {
                    this.overlay = false
                })
				
			}
		},	
		
	}
</script>

<style>
	#title{
		margin-top: 0px;
		height: 0;
		opacity: 0;
		animation: showt 4s 1 alternate;
	}
	#main{
		margin-top: 350px;
		animation: showm 4s 1 alternate; 
	}
	@keyframes showt {
		0% {
			padding-top: 350px;
			opacity: 0;
		}
		
		50% {
			padding-top: 350px;
			opacity: 1;
		}

		100% {
			margin-top: 0px;
			opacity: 0;
			display: none;
		}
	}
	@keyframes showm {
		0% {
			opacity: 0;
			
		}
		99%{
			opacity: 0;
			
		}
		100% {
			opacity: 1;
			
		}
	}
</style>