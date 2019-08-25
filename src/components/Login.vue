<template>
	<v-container>
        <v-layout  align-center justify-center id='title'>
			<h1 class='display-4' >Welcome to Pegass</h1>
		</v-layout>
		<!-- <v-container fluid fill-height>
	        <v-layout  align-center justify-center>
	          	<v-flex lg6 id='main'>
	            	<v-card class="elevation-12">
            			<v-toolbar dark :color="color" class='mb-2'>
		                	<v-toolbar-title>{{currentTitle}}</v-toolbar-title>
	              		</v-toolbar>
              			<v-window v-model='step'>
              				<v-window-item :value="1" class='px-3'>
              					<v-text-field class='mt-4' prepend-icon="phone" :mask='"phone"' label='Phone number' prefix='+7 ' color='rgba(0,0,0,0.54)'></v-text-field>
              				</v-window-item>
              				<v-window-item :value="2" class='px-3'>
              					<v-text-field  label="Code" type="text" color='rgba(0,0,0,0.54)'></v-text-field>
              				</v-window-item>
              				<v-window-item :value="3" class='px-3'>
              					<v-text-field  label="Username" v-model='username' type="text" color='rgba(0,0,0,0.54)'></v-text-field>
              					<v-text-field  label="Email" v-model='email' type="text" color='rgba(0,0,0,0.54)'></v-text-field>
              					<v-text-field  label="Password" v-model='password' type="password" color='rgba(0,0,0,0.54)'></v-text-field>
              				</v-window-item>
              			</v-window>
	              		<v-card-actions>
	                		<v-spacer></v-spacer>
	                		<v-btn v-if='step < 3' :color="color"@click='step++' dark>Next</v-btn>
	                		<v-btn v-else :color="color" @click='send' dark>Submit</v-btn>
	              		</v-card-actions>
	            	</v-card>
	          	</v-flex>
	        </v-layout>
	    </v-container> -->
	    
		<div class='d-flex justify-center' id='main'> 
			<v-flex lg8>
				<v-card class="elevation-12">
					<v-toolbar dark :color="color" class='mb-2'>
						<v-toolbar-title>{{currentTitle}}</v-toolbar-title>
					</v-toolbar>
					<v-text-field class='px-2' @keyup.enter='send' label="Имя пользователя" v-model='username' type="text" color='rgba(0,0,0,0.54)'></v-text-field>
					<v-text-field class='px-2' label="Пароль" v-model='password' type="password" color='rgba(0,0,0,0.54)'></v-text-field>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn :color="color" @click='send'  dark>Войти</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
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
				color: "indigo lighten-1",
				username: '',
				email: '',
				password: '',
			}
		},
		computed:{
			currentTitle(){
				switch(this.step) {
					case 1:
						return 'Введите имя пользователя и пароль'
						break
					case 2:
						return 'Код аутентификации'
						break
					case 3:
						return 'Информация о пользователе'
						break
				}
			}
		},
		methods: {
			send(){
				// let data = new FormData()
				// data.append("username", this.username)
				// data.append("password", this.password)
				// data.append("grant_type", "password")
				// this.$store.dispatch('retrieveToken', data)
				// .then((response) => {
				// 	this.$store.state.username = this.username
				// 	this.$router.push("/")
				// }) 
				localStorage.username = this.username
				this.$store.commit("retrieveUsername", this.username)
				this.$router.push("/")
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
			margin-top: 450px;
			opacity: 0;
		}
		
		50% {
			margin-top: 450px;
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