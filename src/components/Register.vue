<template>
    <v-container>
		<div class='d-flex justify-center align-center' style='margin-top: 350px;'> 
			<v-flex lg8>
				<v-card class="elevation-2 ">
					<v-toolbar dark :color="color" class='mb-2'>
						<v-toolbar-title>Регистрация</v-toolbar-title>
					</v-toolbar>
                     <v-row>
                        <v-col cols="12" sm="6">
                           <v-text-field class='px-2' prepend-icon="mdi-account" label="Имя пользователя" v-model='username' :color='color' type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field class='px-2' prepend-icon="mdi-email" label="E-Mail" v-model='email' :color='color' type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                             <v-file-input class='px-2' type="file" accept="image/*"  v-model='file' prepend-icon="mdi-camera" label="Фото профиля"></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field class='px-2' prepend-icon="mdi-key" label="Пароль" v-model='password' :color='color' type="password" @keyup.enter='register'></v-text-field>
                        </v-col>
                    </v-row>
					<v-card-actions>
						<v-spacer></v-spacer>
                        <small class='mr-4'>Уже есть аккаунт?&nbsp; <router-link to='/login'>Войти</router-link></small>
						<v-btn :color="color" @click='register' dark>Зарегистрироваться</v-btn>
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
    import cloudinary from 'cloudinary-core' 
    import axios from 'axios'
    export default {
        name: 'Register',
        data(){
            return {
                color: "#5C6BC0",
                username: '',
                password: '',
                overlay: false,
                cloudinary: {
                    uploadPreset: 'pegass_preset',
                    apiKey: '893367471257931',
                    cloudName: 'dfj4kyerl'
                },
                file: null,
                email: ''
            }
        },
        methods: {
            imageChange(e){
                this.file = e.target.files[0]
            },
            register(){
                this.overlay = true
                const formData = new FormData()
                formData.append('file', this.file)
                formData.append('upload_preset', this.cloudinary.uploadPreset)
                let data = {
                    "username": this.username,
                    "email": this.email,
                    "password": this.password,
                    "photo_url": "https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false"
                }
                axios.post('https://api.cloudinary.com/v1_1/dfj4kyerl/image/upload', formData)
				.then((resp) => {
                    this.$store.dispatch("SIGN_UP", data, resp.data.secure_url)
                    .then(() => {
                        this.$router.push("/")
                    })
                    .catch((error) => {
                        this.overlay = false
                    })
                })
                .catch((err) => {
                    this.overlay = false
                })
                
            }
        }
    }
</script>       