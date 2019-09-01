<template>
	<v-card height='800'>
		<div class='d-inline-flex mt-5'>
			<v-avatar size="90" :tile='false' class='mx-2 my-2'>
				<img :src="user.img_url" alt="">
			</v-avatar>
			<div class='d-flex flex-column mt-2'>
				<h2 class=''>{{user.name}}</h2>
				<v-subheader class='align-self-start'>{{user.email}}</v-subheader>
			</div>
		</div>
		<div style='height: 500px;' class='d-flex justify-center align-stretch'>
			<h1 class='display-4 font-weight-thin  align-self-center'>*CONTENT*</h1>
		</div>
	</v-card>
</template>

<script>
	
	export default {
		name: 'Profile',
		data(){
			return {
				color: "#5C6BC0",
			}
		},
		computed: {
			user(){
				return this.$store.state.user
			}
		},
		methods: {
			logout(){
				this.$store.dispatch("logout")
				.then(() => {
					this.$router.push("/login")
				})
			}
		}
	}
</script>