<template>
	<v-card height='800'
	class="scroll-y"
	id='scroll-target'>
		<div class='d-inline-flex mt-5'>
			<v-avatar size="90" :tile='false' class='mx-2'>
				<img :src="user.photo_url" alt="">
			</v-avatar>
			<div class='d-flex flex-column mt-2'>
				<h2 class=''>{{user.username}}</h2>
				<v-subheader class='align-self-start'>{{user.email}}</v-subheader>
			</div>
		</div>

		
		<v-card v-if='friends' class='d-flex flex-column justify-center align-stretch mt-6 mx-6'>
			<v-app-bar
			dense
			:color="color"
			dark
			>
				<v-toolbar-title @click='showFriends' id='friends_title'>Друзья</v-toolbar-title>
			</v-app-bar>
			<div class='d-inline-flex'>
				<div v-for='(friend, i) in friends' :key='i' >
					<v-card outlined tile flat class='mx-2 my-3'>
						<v-avatar size='50' :tile='true' class='mt-3 mx-3'>
							<img :src="friend.photo_url" >
						</v-avatar>
						<p class='ml-1'>{{friend.username}}</p>
					</v-card>
				</div>
			</div>
			
		</v-card>


		<v-card class='d-flex flex-column justify-center align-stretch my-6 mx-6' >
			<v-app-bar
			dense			
			:color="color"
			dark
			>
				<v-toolbar-title>Записи</v-toolbar-title>
			</v-app-bar>
			<div >
				<!-- филд для нового поста -->
				 <div >				
					<v-textarea
						label='Напишите что-нибудь'
						auto-grow
						filled
						rows="1"
						row-height="15"
						class='pt-4 px-10'
						color='rgba(0, 0, 0, 0.54)'
						background-color='#fff'
						v-model='post'
						@keyup.enter='publishPost' 
						:prepend-icon="'mdi-camera'"
						@click:prepend=""
					></v-textarea>
					<v-btn class='mb-5 align-self-right' dark :color='color' small @click='publishPost'>Опубликовать</v-btn>
				</div>

				<v-divider></v-divider>

				 <!-- посты -->
				<div v-if='posts' class='d-flex flex-column mx-2 mt-5'>
					<div v-for='(post, i) in posts' :key='i' class='d-flex justify-start my-2'>
						<div  class="d-inline-flex py-1" id='card_wrapper'>
							<v-avatar size="55" :tile='false' class='mt-2 ml-3'>
								<img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false" >
							</v-avatar>
							<div class='d-flex flex-column ml-4 mt-1'>
								<div class='d-inline-flex justify-start text-wrap'>
									<h3 class='font-weight-thick align-self-start'>{{user.username}}</h3>
									<small  class='mt-1' :style="`color:${color}`">&nbsp;&nbsp;выложил запись {{time(post.time)}}</small>
								</div>
								<h4 id='h1' class='font-weight-thin mt-1'>{{post.text}}</h4>
								
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</v-card>
	</v-card>
</template>

<script>
	import {mapState} from 'vuex'
	import { usersRef } from '../firebase'

	export default {
		name: 'Profile',
		props: ["color"],
		data(){
			return {
				post: ''
			}
		},
		computed: {
			...mapState(["user"]),
			friends(){
				return this.user.friends
			},
			posts(){
				return this.user.posts.reverse()
			}
		},
		methods: {
			showFriends(){
				this.$emit("changeLocation", 1)
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
			publishPost(){
				let data = {
					"text": this.post,
					"img_url": "",
					"time": (new Date()).toString()
				}
				this.$store.dispatch("PUBLISH_POST", data)
				this.post = ''
			}
			
		},
		
	}
</script>

<style>
	#friends_title:hover {
		cursor:pointer;
	}
	#card_wrapper{
		border: 1px solid #bdbdbd;
		border-radius: 5px;
	}
</style>