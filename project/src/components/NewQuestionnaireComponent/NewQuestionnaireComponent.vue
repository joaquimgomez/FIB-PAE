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
            organizations: null,
            send: 0,
            given_id: null
        }
    },
    methods: {
        create: function () {
            //create poll
            if (!this.created){

                if (this.name == "" || this.org_id == null){
                    this.launchNotify("Error", "The name and the organization can't be empty.", "error");
                } else {
                
                    axios.post("http://localhost:3000/poll",
                        {
                            name: this.name,
                            org_id: this.org_id,
                            questions: []
                        })
                        .then(response => {
                            console.log("POST OK", response);
                            this.given_id = response.data;
                            console.log(this.given_id)
                            this.created = true;
                        })
                        .catch(error => {
                            this.launchNotify("Error", "Error al hacer post de la enquesta", "error");
                            console.log(error);
                        });
                }

            } else {
                this.send++
                console.log('emit')
            }
        },
        launchNotify(title, message, type) {
            this.$notify({
                title: title,
                message: message,
                type: type
            });
        }
    },
    components: {
        "questionform": questionform
    },
    mounted () {
    
        axios.get('http://localhost:3000/organization')
                .then(response => (this.organizations = response.data));
    }
}
</script>

<template src="./NewQuestionnaireComponent.html"></template>
<style src="./NewQuestionnaireComponent.css"></style>