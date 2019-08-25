<template>
	<v-app>
		<v-container fluid fill-height>
	        <v-layout align-center justify-center>
	          	<v-flex lg6>
	            	<v-card>
				        <v-card-title class="headline grey lighten-2" primary-title>Выберите изображение</v-card-title>
				        <div id="dropbox" class='mt-3'>
				          	<input type="file" accept="image/*" id="input-file" @change='imageChange'>
				          	<v-flex class='text-lg-center'>
				          		<v-flex lg12 class='d-inline-flex'>
				          		  	<v-icon large>add_a_photo</v-icon>
				          			<p class='mt-3 pl-3'>Перетащите файл для загрузки</p>
				          		</v-flex>
				          	</v-flex>
				        </div>
				        <div id='img'>
				        	<v-btn v-if="file != null" small fab style='margin-left: 350px;' @click='remove' color="error">X</v-btn>
							<v-layout align-center justify-center row fill-height>
								<v-progress-circular v-if="loading"
							        indeterminate
							        color="error"
							    ></v-progress-circular>
							</v-layout>
				        	
				        </div>
				        <v-divider></v-divider>
				        <v-card-actions v-if='!loading'>
				            <v-spacer></v-spacer>
				            <v-btn color="primary" flat @click='send'>Готово</v-btn>
				        </v-card-actions>
				        <v-card-actions v-else>
				        	<v-alert v-if='error' type="error">
				        		{{error}}
				        	</v-alert>
				            <v-spacer></v-spacer>
				            <v-progress-circular indeterminate color="primary" class='mr-5' :size='37'></v-progress-circular>
				        </v-card-actions>
				    </v-card>
	          	</v-flex>
	        </v-layout>
	    </v-container>
	</v-app>
</template>

<script>
	import axios from 'axios'
	import socketio from 'socket.io-client'
	export default {
		name: "Ex",
		data() {
			return {
				file: null,
				imgsrc: '',
				error: '',
				loading: false,
			}
		},
		computed:{
			
		},
		methods: {
			remove(){
				this.file = null
				this.imgsrc = ''
			},
			imageChange(e){
				this.file = e.target.files[0]
				if (this.file) {
		        	const reader = new FileReader()
		        	reader.onload = (event) => {
		            	this.imgsrc = event.target.result
		            	
		        	}
		        	reader.readAsDataURL(this.file)
		    	}
			},
			send(){
				const data = new FormData()
				let div = document.getElementById("img")
				div.style.opacity = 0.5
				this.loading = true
				data.append('file', this.file)
				axios.post("https://pegassback.herokuapp.com/uploads", data)
				.then( (response) => {
					div.style.opacity = 1
					this.loading = false
					this.imgsrc = 'data:image/jpeg;base64,' + response.data
					console.log(response.data)
					// if (this.file) {
			  //       	const reader = new FileReader()
			  //       	reader.onload = (event) => {
			  //           	this.imgsrc = event.target.result
			  //       	}
			  //       	reader.readAsDataURL(this.file)
			  //   	}
					
				})
			}
		},
		created(){
			// let socket = io("https://flask-io-chat.herokuapp.com/")
			// socket.on("connect", () => {
			// 	console.log("connected")
			// })
			// socket.on("message", (response) => {
			// 	console.log(response)
			// })
		},
		mounted(){
			window.addEventListener("dragover", (e) => {
	            e.preventDefault()
	            document.querySelector("#dropbox").style.opacity = 0.3
	      	})
	      	window.addEventListener("drop", (e) => {
	            e.preventDefault()
	            document.querySelector("#dropbox").style.opacity = 1
	          	this.file = e.dataTransfer.files[0]
	          	if (this.file) {
		        	const reader = new FileReader()
		        	reader.onload = (event) => {
		            	this.imgsrc = event.target.result
		        	}
		        	reader.readAsDataURL(this.file)
		    	}  
	        })
		},
		watch: {
			imgsrc(newValue){
				let div = document.getElementById("img")
				if (newValue != ''){
					div.style.width = "400px";
					div.style.height = "500px";
					div.style.marginLeft = '150px'
					div.style.background = `url(${newValue})`
					div.style.backgroundSize = 'contain'
				}
				else {
					div.style.width = "0px";
					div.style.height = "0px";
				}
			}
		}
	}
</script>

<style lang='scss'>
	#dropbox {
	    outline: 2px dashed gray;
	    outline-offset: -15px;
	}
	#dropbox p {
	    font-size: 20px;
	    text-align: center;
	    padding: 50px 0;
	}
	#input-file {
	    opacity: 0; 
	    width: 100%;
	    height: 120px;
	    position: absolute;
	    cursor: pointer;
	}
	#img:hover {
		opacity: 0.9;
		border: 2px solid #ff5252;
		cursor: pointer;
	}
	#imgChanged{
		width: 260px;
		height: 350px;
		margin-left: 180px;
	}
</style>