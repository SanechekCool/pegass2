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
                        <v-card flat tile class="d-flex" @click='appendSticker(item)'>
                            <h1>{{item}}</h1>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-menu>
        <v-text-field
        class='pt-4 px-2'
        label='Напишите сообщение' 
        solo
        color='#000'
        v-model='message'
        autofocus
        @keyup.enter='sendMessage' 
        :append-outer-icon="'mdi-send'"
        :append-icon="'mdi-face'"
        @click:append="show"
        @click:append-outer="sendMessage"></v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'MessageField',
        props: ["username", "socket"],
        data(){
            return {
                message: '',
                x: 0,
                y:0,
                menu: false,
                emojies: [`\u{1F602}`, "\u{1F60D}", "\u{1F606}", "\u{1F609}", "\u{1F60F}", "\u{1F618}", "\u{1F621}", "\u{1F624}", "\u{1F630}", "\u{1F60E}", "\u{1F496}",
                "\u{1F4A9}", "\u{1F62C}"],
                items: [
                    { src: './assets/stickers/1.png', i: 0 },
                    { src: './assets/stickers/2.png', i: 1 },
                    { src: './assets/stickers/3.png', i: 2 },
                ],
            }
        },
        computed: {
            current_room(){
				let names = [this.username, localStorage.username]
				return names.sort().join("_")
			},
        },
        methods: {
            sendMessage(){
                this.socket.emit("send_message", {"room": this.current_room, "username": localStorage.username, "text": this.message})
				this.message = ''
            },
            show(e){
                e.preventDefault();
                this.showMenu = false
                this.x = e.clientX
                this.y = e.clientY
                this.$nextTick(() => {
                    this.menu = true
                })
            },
            appendSticker(item){
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