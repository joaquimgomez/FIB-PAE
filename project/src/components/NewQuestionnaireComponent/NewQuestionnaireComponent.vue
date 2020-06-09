<script>

//import Vue from 'vue';
//import axios from 'axios'
//import VueAxios from 'vue-axios'
//import Vuex from 'vuex'

import questionform from './QuestionFormComponent.vue'

export default {
    name: 'newquestionnaire',
    data() {
        return {
            num: 1,
            name: ""
        }
    },
    methods: {
    },
    components: {
        questionform
    }
}
</script>

<template src="./NewQuestionnaireComponent.html"></template>
<style src="./NewQuestionnaireComponent.css"></style>