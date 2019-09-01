<template>
    <v-card height='800'>
        <v-row class='mx-2'>
            <v-text-field v-model='users' label='Имя пользователя' @keyup.enter='search' :color='color' class='px-3 pt-3' solo  prepend-inner-icon="search"></v-text-field>
            <v-btn :color="color" text dark class='mt-5' @click='search'>Поиск</v-btn>
        </v-row>
        <v-card v-if='foundUser.username != undefined' class='mx-3' height='90'>
            <div  class='d-flex justify-space-between' >
                <div class="d-inline-flex">
                    <v-avatar size="80" :tile='false' class='mt-2 ml-3'>
                        <img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false" >
                    </v-avatar>
                    <div class='d-flex flex-column ml-4 mt-2'>
                        <h2 class='font-weight-thick align-self-start'>{{foundUser.username}}</h2>
                        <small class='font-weight-thin mt-1 align-self-start'>{{foundUser.email}}</small>
                    </div>
                </div>
                <div class='d-inline-flex mt-1 justify-end mr-1'>
                    <v-btn class="mt-5 mr-6 pr-3" :color="color" dark fab small>
                        <v-icon dark right>add</v-icon>
                    </v-btn> 
                    <v-btn class="mt-5 mr-5 pr-3" :color="color" dark fab small @click='startDialog'>
                        <v-icon dark right>message</v-icon>
                    </v-btn>
                </div>
            </div>
        </v-card>
        <v-layout v-else align-center justify-center row fill-height>
            <h1>У вас пока нет друзей</h1>
        </v-layout>
    </v-card>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Search',
        data(){
            return {
                color: "#5C6BC0",
                users: '',
                foundUser: {}
            }
        },
        methods: {
            search() {
                axios.get(this.$store.state.domain + "api/user/" + this.users)
				.then((response) => {
			    	this.foundUser = response.data
                })
            },
            startDialog(){
				let names = [localStorage.username, this.foundUser.username]
				names.sort()
				let data = {
					"name": names.join("_"),
					"users": names,
                }
                this.$emit("startDialog", data, this.foundUser.username)
				
			}
        }
    }
</script>

