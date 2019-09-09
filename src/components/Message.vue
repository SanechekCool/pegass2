<template>
    <div class='d-flex flex-column mx-2' >
        <div class='mes' :class='{owner}' @click='deleteMessage(id, i)'>
            <v-avatar v-if='!owner' :size='30'><img src="https://avatars.mds.yandex.net/get-pdb/1530302/8676c879-8108-44d4-8009-736ac8e067bb/s1200?webp=false" alt=""></v-avatar>
            <h4 class='ml-2'>{{text}}</h4>
            <small class='pt-5 pl-2'>{{time(timestamp)}}</small>
        </div>
        
    </div>
    
</template>

<script>
    export default {
        name: 'Message',
        props: ['id', "text", "owner", "color", "timestamp", "i"],
        data(){
            return {
            }
        },
        methods: {
            time(date){
				let m_date = new Date(Date.parse(date + 'Z'))
				if (+new Date(m_date).getMinutes() > 9) {
					return (+new Date(m_date).getHours()).toString() + ":"  + new Date(m_date).getMinutes()
				}
				else {
					return (+new Date(m_date).getHours()).toString()  + ":0"  + new Date(m_date).getMinutes()
				} 
            },
            deleteMessage(id, i){
                if (this.owner) this.$emit("deleteMessage", id, i)
				
			},
        }  
    }
</script>

<style>
    .mes{
        display: inline-flex;
        height: 50px;
        align-self: flex-start;
        padding: .7rem .8rem 0 0;
        box-shadow: 1px 1px 1px 1px #bdbdbd;
        margin: 0 0 0.5rem 0;
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