<template>
    <div id="text">
        <v-menu v-model='menu' 
        :position-x="x"
        :position-y="y"
        top
        absolute
        :close-on-content-click='false'
        color='white'
        max-width="200"
        max-height="300"
        offset-y>
            <v-card > 
                <v-row>
                    <v-col
                    v-for="(item, index) in emojies"
                    :key="index"
                    class="d-flex child-flex"
                    cols="4"
                    >
                        <v-card flat tile class="d-flex" @click='appendEmojy(item)'>
                            <h1>{{item}}</h1>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-menu>
        <v-textarea
        label='Напишите сообщение'
        auto-grow
        filled
        rows="1"
        row-height="15"
        class='pt-4 px-2'
        color='rgba(0, 0, 0, 0.54)'
        background-color='#fff'
        v-model='message'
        autofocus
        @keyup.enter='sendMessage' 
        :append-outer-icon="'mdi-send'"
        :append-icon="'mdi-emoticon'"
        @click:append="show"
        @click:append-outer="sendMessage"
        ></v-textarea>
    </div>
</template>

<script>
    import {firestore} from '../firebase.js'
    
    export default {
        name: 'MessageField',
        props: ["friend",  "user", "roomName"],
        data(){
            return {
                message: '',
                x: 0,
                y:0,
                menu: false,
                emojies: [`\u{1F602}`, "\u{1F60D}", "\u{1F606}", "\u{1F609}", "\u{1F60F}", "\u{1F618}", "\u{1F621}", "\u{1F624}", "\u{1F630}", "\u{1F60E}", "\u{1F496}",
                "\u{1F4A9}", "\u{1F62C}", "\u{1F61E}", "\u{1F62D}", "\u{1F37A}", "\u{1F37B}", "\u{1F631}"],
                items: [
                    { src: './assets/stickers/1.png', i: 0 },
                    { src: './assets/stickers/2.png', i: 1 },
                    { src: './assets/stickers/3.png', i: 2 },
                ],
            }
        },
       
        methods: {
            sendMessage(){
                
                firestore.collection("dialogs").doc(this.roomName).collection("messages").add({
                    text: this.message,
                    time: new Date(),
                    user: {
                        "username": this.user.displayName,
                    }
                })
                .then((docRef) =>{
                    firestore.collection("users").doc(this.user.uid).collection("dialogs").doc(this.roomName).set({
                        lastMessage: {
                            text: this.message,
                            time: new Date(),
                            messageId: docRef.id,
                            user: {
                                username: this.user.displayName,
                            }
                        },
                        username: this.friend.username,
                        photoUrl: this.friend.photoUrl || ""
                    })
                    let _message = {
                        lastMessage: {
                            "text": this.message,
                            "time": 
                            {
                                "seconds": (new Date()).getTime() / 1000,
                            },
                            "messageId": docRef.id,
                            "user": {
                                "username": this.user.displayName,
                            }
                        },
                        "username": this.friend.username,
                        "room": this.roomName,
                        "photoUrl": this.friend.photoUrl || ""
                    }
                        
                    this.$store.commit("newMessage", [this.roomName, _message])
                    this.message = ''
                })
                .catch((error) => {
                    console.error("Error adding document: ", error)
                });
				
            },
            show(e){
                e.preventDefault();
                this.showMenu = false
                this.x = e.clientX - 100
                this.y = e.clientY - 45
                this.$nextTick(() => {
                    this.menu = true
                })
            },
            appendEmojy(item){
                this.message += item
            }
        }
    }
</script>

<style>
    #text{
		background-color: #BDBDBD;
		position: relative;
	}
   
</style>