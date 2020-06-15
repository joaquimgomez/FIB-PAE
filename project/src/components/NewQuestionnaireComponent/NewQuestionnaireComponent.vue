<script>

//import Vue from 'vue';
import axios from 'axios'
//import VueAxios from 'vue-axios'
//import Vuex from 'vuex'

import questionform from './QuestionFormComponent.vue'

export default {
    name: 'newquestionnaire',
    data() {
        return {
            num: 1,
            name: "",
            org_id: null,
            created: false,
            organizations: null
        }
    },
    methods: {
        create: function () {
            //create poll
            console.log(this.organizations);
            this.created = true;
        }
    },
    components: {
        questionform
    },
    mounted () {
    
        axios.get('http://localhost:3000/organization')
                .then(response => (this.organizations = response.data));
    }
}
</script>

<template src="./NewQuestionnaireComponent.html"></template>
<style src="./NewQuestionnaireComponent.css"></style>