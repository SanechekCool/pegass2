<template>
	<div class="d-flex justify-center" id='window'> 
		<v-flex lg8>
			<v-card class="elevation-2">
				<v-toolbar dark :color="color" class='mb-2'>
					<v-toolbar-title>Введите почту и пароль</v-toolbar-title>
				</v-toolbar>
				<v-text-field class='px-2' prepend-icon="mdi-email" label="Email" :color='color' v-model='email' type="text"></v-text-field>
				<v-text-field class='px-2' prepend-icon="mdi-lock"  label="Пароль" @keyup.enter='send' v-model='password' :color='color' type="password"></v-text-field>
				<v-card-actions>
					<v-spacer></v-spacer>
					<small class='mr-4'>Не зарегестрированы?&nbsp; <router-link to='/register'>Создать аккаунт</router-link></small>
					<v-btn :color="color" @click='send' dark>Войти</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
		<v-overlay :value="overlay">
			<div id='cont_anim' class='d-flex justify-center '>
				<img id='animation' src="./assets/logo/logo1x.svg" alt="">
			</div>
		</v-overlay>
	</div>
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
				this.$store.dispatch("LOG_IN", {"email": this.email, "password": this.password})
				.then(()=> {
					this.$router.push("/")
				})
				.catch((err) => {
					alert(err)
					this.overlay  = false
				})
				
			}
		},	
		created(){
			
			if (localStorage.uid != undefined) {
				this.$router.push("/")
			}
		}
	}
</script>

<style>
	#window{
		margin-top: 350px;
	}
	@media screen and (max-height: 850px) {
		#window {
			margin-top: 200px;
		}
	}
</style>