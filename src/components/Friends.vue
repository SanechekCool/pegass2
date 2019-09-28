<template>
    <v-card height='800'>
        <h1 class='py-2' @click='showFriends' style='cursor: pointer;'>Друзья</h1>
        <v-row class='mx-2'>
            <v-text-field v-model='userField' label='Имя пользователя' @keyup.enter='search' :color='color' class='px-3 pt-3' solo  prepend-inner-icon="search"></v-text-field>
            <v-btn :color="color" text dark class='mt-5' @click='search'>Поиск</v-btn>
        </v-row>


        <div v-for='(friend, i) in friends' :key='i' class='my-2'>
            <div v-if='!found' class='d-flex justify-space-between mx-3' >
                <div class="d-inline-flex">
                    <v-avatar :size="size" :tile='false' class='mt-2 ml-3'>
                        <img :src="friend.photo_url" >
                    </v-avatar>
                    <div class='d-flex flex-column ml-4 mt-1' >
                        <h2 id='username' class='font-weight-thick align-self-start'>{{friend.username}}</h2>
                        <small id='email' class='font-weight-thin align-self-start'>{{friend.email}}</small>
                    </div>
                </div>
                <div class='d-inline-flex mt-1 justify-end mr-1' id='buttons'>
                    <v-btn  class="mt-3 mr-6 pr-3 d-flex " color="success" dark fab small id='email'>
                        <v-icon dark right>done</v-icon>
                    </v-btn>
                    <v-btn class="mt-3 mr-5 pr-3" :color="color" dark fab small @click='startDialog(friend)'>
                        <v-icon dark right>message</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-divider v-if='!found' class='my-2 ml-7'></v-divider>
        </div>


        <div v-if='foundUser.username' class='d-flex justify-space-between mx-3' >
            <div class="d-inline-flex">
                <v-avatar :size="size" :tile='false' class='mt-2 ml-3'>
                    <img :src="foundUser.photo_url" >
                </v-avatar>
                <div class='d-flex flex-column ml-4 mt-1'>
                    <h2 id='username' class='font-weight-thick align-self-start'>{{foundUser.username}}</h2>
                    <small id='email' class='font-weight-thin  align-self-start'>{{foundUser.email}}</small>
                </div>
            </div>
            <div class='d-inline-flex justify-end mr-1'>
                <v-btn v-if='!checked && !added' class="mt-3 mr-6 pr-3" :color="color" dark fab small @click.once='addFriend'>
                    <v-icon dark right>add</v-icon>
                </v-btn> 
                <v-btn v-if='checked' class="mt-3 mr-6 pr-3" color="success" dark fab small>
                    <v-icon dark right>done</v-icon>
                </v-btn>
                 <v-btn v-if='added' class="mt-3 mr-6 pr-3" color="success" dark fab small>
                    <v-icon dark right>done</v-icon>
                </v-btn>
                <v-btn  class="mt-3 mr-5 pr-3" :color="color" dark fab small @click='startDialog(foundUser)'>
                    <v-icon dark right>message</v-icon>
                </v-btn>
            </div>
        </div>
        
        <v-layout v-if='(!friends) && (!found)' align-center justify-center row fill-height>
            <h1>У вас пока нет друзей</h1>
        </v-layout>
    </v-card>
</template>

<script>
    import axios from 'axios'
    import {usersRef} from '../firebase.js'
    import {mapState} from 'vuex'

    export default {
        name: 'Friends',
        data(){
            return {
                color: "#5C6BC0",
                userField: '',
                found: false,
                size: 50,
                checked: false,
                added: false,
                foundUser: {}
            }
        },
        computed: {
            ...mapState(["user"]),
            friends(){
                return this.$store.state.user.friends
            },
            
        },
        methods: {
            check(username){
                return this.friends.some((a) => a.username == username)
            },
            search() {
                if (this.check(this.userField)) this.checked = true
                else this.checked = false
                if (this.userField != this.user.username) {
                    usersRef.where("username", "==", this.userField).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            this.foundUser = doc.data()
                            this.foundUser["id"] = doc.id
                            this.found = true
                        })
                    })
                }
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
            showFriends(){
                this.foundUser = {}
                this.found = false
                this.userField = ''
            },
            addFriend(){
                this.$store.dispatch("ADD_FRIEND", this.foundUser)
                this.added = true
            },
            startDialog(user){
                let room = [user.id, this.user.uid].sort().join("_")
                user["room"] = room
                this.$emit("startDialog", user)
				
			}
        }
    }
</script>


<style>
    @media screen and (max-width: 490px) {
        #username {
            font-size: 20px;
        }
        #email {
            opacity: 0;
        }
        #buttons {
            margin: 0;
            padding: 0;
        }
    }
</style>
