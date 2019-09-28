<template>
    <div>
        <div class='d-flex flex-column mx-2 my-2'>
        <v-menu offset-y absolute>
            <template v-slot:activator="{ on }">
                <div class='mes' :class='{owner}' v-on='on'>
                    <v-avatar v-if='!owner' :size='30'><img :src="src" alt=""></v-avatar>
                    <h4 class='ml-2 text-left'>{{text}}</h4>
                    <small class='pt-5 '>{{time(timestamp)}}</small>
                </div>
            </template>
            <v-list>
                <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click='deleteMessage(id)'
                >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>


    
    </div>
    
    
</template>

<script>
    export default {
        name: 'Message',
        props: ['id', "src", "text", "owner", "color", "timestamp"],
        data(){
            return {
                 items: [
                    { title: 'Удалить' },
                    
                ],
                alert: false
            }
        },
        methods: {
            time(date){
				let options = {
					hour: 'numeric',
					minute: 'numeric',
				}
				
				let m_date = new Date(date.seconds * 1000)
				return m_date.toLocaleString("ru", options)
			},
            deleteMessage(id, i){
                if (this.owner) this.$emit("deleteMessage", id)
				else this.$emit("deleteAlert")
			},
        }  
    }
</script>

<style>
    .mes{
        display: inline-flex;
        align-self: flex-start;
        padding: .7rem .8rem 0 .4rem;
        border: 1px solid #bdbdbd;
        border-radius: 4px;
        background-color: #fff;

        
    }
   
    .mes:hover{
        cursor: pointer;
    }
    .owner {
        align-self: flex-end;
        color: #fff;
        background-color: #5C6BC0;
    }
</style>