<template>
    <div id="text">
        <v-text-field
        class='pt-4 px-2'
        label='Напишите сообщение' 
        solo
        color='#000'
        v-model='message'
        autofocus
        @keyup.enter='sendMessage' 
        :append-outer-icon="'send'"
        @click:append-outer="sendMessage"></v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'MessageField',
        props: ["username", "socket"],
        data(){
            return {
                message: ''
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