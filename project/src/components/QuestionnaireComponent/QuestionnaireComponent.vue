<script>
//import { Form as ElForm } from "element-ui";
//import ElementUI from "element-ui";
import Vue from "vue";
import Vuex from "vuex";
import { mapState } from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import "element-ui/lib/theme-chalk/index.css";

//import TutorialDataService from "../../services/TutorialDataService";

Vue.use(VueAxios, axios);
Vue.use(Vuex)

export default {
  name: "QuestionnaireComponent",
  data() {
    return {
      name__view: "Questionnaire",

      labels:{
        name: "Name",
        age: "Age"
      },
      ruleForm: {
        name: "",
        age: ""
      },

      questions:[
        {
          index: "",
          question_label: "Question 1 de prueba",
          type: "",
          answer: ""
        }
      ]

      
    }
    
  },
  components: {},
  computed: {
    ...mapState([
    ])
  },
  methods: {
    
  },
  mounted(){
    this.questions.push({
      index:"",
      question_label: "Question 2 de prueba",
      type:"",
      answer:""
    })
  }
};

</script>

<template src="./QuestionnaireComponent.html"></template>    
<style src="./QuestionnaireComponent.css"></style>

