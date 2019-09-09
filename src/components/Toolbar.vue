<template>
    <div>
        <v-toolbar :color="color" dark >
            <v-app-bar-nav-icon @click='show_close'></v-app-bar-nav-icon>
            <v-toolbar-title>Pegass</v-toolbar-title>
            
        </v-toolbar>
    </div>
</template>

<script>
export default {
    name: 'Toolbar',
    props: ["color", "drawer"],
    data() {
        return {
        }
    },
    methods: {
        show_close(){
            this.$emit("changeDrawer", !this.drawer)
        }
    }
}
</script>